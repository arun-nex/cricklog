import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { RealtimeEvent, MatchUpdateEvent, BallUpdateEvent, WicketEvent, BoundaryEvent, MilestoneEvent, NotificationEvent, LiveMatchData, WebSocketConnection, RealtimeStats } from '../models/Realtime';

export class WebSocketService {
  private io: SocketIOServer;
  private connections: Map<string, WebSocketConnection> = new Map();
  private matchSubscriptions: Map<string, Set<string>> = new Map();
  private eventHistory: RealtimeEvent[] = [];
  private stats: RealtimeStats = {
    total_connections: 0,
    active_matches: 0,
    events_sent: 0,
    events_per_second: 0,
    top_matches: []
  };

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: [
          process.env.CORS_ORIGIN || '*',
          'https://cricklog.vercel.app',
          'https://cricklog-a8ch1saj6-arun-nexs-projects.vercel.app',
          'https://cricklog-nasyk2cuf-arun-nexs-projects.vercel.app',
          'https://cricklog-2dk4.vercel.app',
          /^https:\/\/cricklog-.*\.vercel\.app$/
        ],
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventHandlers();
    this.startHeartbeat();
    this.startStatsCollection();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      
      const connection: WebSocketConnection = {
        id: socket.id,
        socket_id: socket.id,
        connected_at: new Date(),
        last_activity: new Date(),
        subscriptions: []
      };
      
      this.connections.set(socket.id, connection);
      this.stats.total_connections++;

      // Handle subscription to match updates
      socket.on('subscribe_match', (data: { match_id: string, user_id?: string }) => {
        this.subscribeToMatch(socket.id, data.match_id, data.user_id);
        socket.emit('subscription_confirmed', { match_id: data.match_id });
      });

      // Handle unsubscription from match updates
      socket.on('unsubscribe_match', (data: { match_id: string }) => {
        this.unsubscribeFromMatch(socket.id, data.match_id);
        socket.emit('unsubscription_confirmed', { match_id: data.match_id });
      });

      // Handle user identification
      socket.on('identify_user', (data: { user_id: string }) => {
        const connection = this.connections.get(socket.id);
        if (connection) {
          connection.user_id = data.user_id;
          this.connections.set(socket.id, connection);
        }
        socket.emit('user_identified', { user_id: data.user_id });
      });

      // Handle ping/pong for connection health
      socket.on('ping', () => {
        socket.emit('pong');
        const connection = this.connections.get(socket.id);
        if (connection) {
          connection.last_activity = new Date();
          this.connections.set(socket.id, connection);
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.handleDisconnect(socket.id);
      });
    });
  }

  private subscribeToMatch(socketId: string, matchId: string, userId?: string) {
    const connection = this.connections.get(socketId);
    if (connection) {
      connection.subscriptions.push(matchId);
      connection.match_id = matchId;
      if (userId) connection.user_id = userId;
      this.connections.set(socketId, connection);
    }

    if (!this.matchSubscriptions.has(matchId)) {
      this.matchSubscriptions.set(matchId, new Set());
    }
    this.matchSubscriptions.get(matchId)!.add(socketId);
  }

  private unsubscribeFromMatch(socketId: string, matchId: string) {
    const connection = this.connections.get(socketId);
    if (connection) {
      connection.subscriptions = connection.subscriptions.filter(id => id !== matchId);
      this.connections.set(socketId, connection);
    }

    const subscribers = this.matchSubscriptions.get(matchId);
    if (subscribers) {
      subscribers.delete(socketId);
      if (subscribers.size === 0) {
        this.matchSubscriptions.delete(matchId);
      }
    }
  }

  private handleDisconnect(socketId: string) {
    const connection = this.connections.get(socketId);
    if (connection) {
      // Unsubscribe from all matches
      connection.subscriptions.forEach(matchId => {
        this.unsubscribeFromMatch(socketId, matchId);
      });
    }

    this.connections.delete(socketId);
    this.stats.total_connections--;
  }

  // Public methods for sending events
  public sendMatchUpdate(matchId: string, update: MatchUpdateEvent) {
    const event: RealtimeEvent = {
      id: this.generateEventId(),
      type: 'match_update',
      match_id: matchId,
      data: update,
      timestamp: new Date()
    };

    this.broadcastToMatch(matchId, 'match_update', event);
    this.recordEvent(event);
  }

  public sendBallUpdate(matchId: string, update: BallUpdateEvent) {
    const event: RealtimeEvent = {
      id: this.generateEventId(),
      type: 'ball_update',
      match_id: matchId,
      data: update,
      timestamp: new Date()
    };

    this.broadcastToMatch(matchId, 'ball_update', event);
    this.recordEvent(event);
  }

  public sendWicketEvent(matchId: string, wicket: WicketEvent) {
    const event: RealtimeEvent = {
      id: this.generateEventId(),
      type: 'wicket',
      match_id: matchId,
      data: wicket,
      timestamp: new Date()
    };

    this.broadcastToMatch(matchId, 'wicket', event);
    this.recordEvent(event);
  }

  public sendBoundaryEvent(matchId: string, boundary: BoundaryEvent) {
    const event: RealtimeEvent = {
      id: this.generateEventId(),
      type: 'boundary',
      match_id: matchId,
      data: boundary,
      timestamp: new Date()
    };

    this.broadcastToMatch(matchId, 'boundary', event);
    this.recordEvent(event);
  }

  public sendMilestoneEvent(matchId: string, milestone: MilestoneEvent) {
    const event: RealtimeEvent = {
      id: this.generateEventId(),
      type: 'milestone',
      match_id: matchId,
      data: milestone,
      timestamp: new Date()
    };

    this.broadcastToMatch(matchId, 'milestone', event);
    this.recordEvent(event);
  }

  public sendNotification(userId: string, notification: NotificationEvent) {
    const event: RealtimeEvent = {
      id: this.generateEventId(),
      type: 'notification',
      match_id: notification.match_id,
      data: notification,
      timestamp: new Date(),
      user_id: userId
    };

    this.sendToUser(userId, 'notification', event);
    this.recordEvent(event);
  }

  public sendLiveMatchData(matchId: string, data: LiveMatchData) {
    this.broadcastToMatch(matchId, 'live_match_data', data);
  }

  private broadcastToMatch(matchId: string, eventType: string, data: any) {
    const subscribers = this.matchSubscriptions.get(matchId);
    if (subscribers) {
      subscribers.forEach(socketId => {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
          socket.emit(eventType, data);
          this.stats.events_sent++;
        }
      });
    }
  }

  private sendToUser(userId: string, eventType: string, data: any) {
    this.connections.forEach((connection, socketId) => {
      if (connection.user_id === userId) {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
          socket.emit(eventType, data);
          this.stats.events_sent++;
        }
      }
    });
  }

  private recordEvent(event: RealtimeEvent) {
    this.eventHistory.push(event);
    
    // Keep only last 1000 events to prevent memory issues
    if (this.eventHistory.length > 1000) {
      this.eventHistory = this.eventHistory.slice(-1000);
    }
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startHeartbeat() {
    setInterval(() => {
      this.io.emit('heartbeat', { timestamp: new Date().toISOString() });
    }, 30000); // Send heartbeat every 30 seconds
  }

  private startStatsCollection() {
    setInterval(() => {
      this.updateStats();
    }, 5000); // Update stats every 5 seconds
  }

  private updateStats() {
    this.stats.active_matches = this.matchSubscriptions.size;
    
    // Calculate events per second (simplified)
    const now = Date.now();
    const recentEvents = this.eventHistory.filter(event => 
      now - event.timestamp.getTime() < 1000
    );
    this.stats.events_per_second = recentEvents.length;

    // Update top matches
    this.stats.top_matches = Array.from(this.matchSubscriptions.entries())
      .map(([matchId, subscribers]) => ({
        match_id: matchId,
        connections: subscribers.size,
        events: this.eventHistory.filter(e => e.match_id === matchId).length
      }))
      .sort((a, b) => b.connections - a.connections)
      .slice(0, 5);
  }

  public getStats(): RealtimeStats {
    return { ...this.stats };
  }

  public getConnections(): WebSocketConnection[] {
    return Array.from(this.connections.values());
  }

  public getMatchSubscribers(matchId: string): string[] {
    const subscribers = this.matchSubscriptions.get(matchId);
    return subscribers ? Array.from(subscribers) : [];
  }

  public getEventHistory(matchId?: string): RealtimeEvent[] {
    if (matchId) {
      return this.eventHistory.filter(event => event.match_id === matchId);
    }
    return [...this.eventHistory];
  }
}

export default WebSocketService;
