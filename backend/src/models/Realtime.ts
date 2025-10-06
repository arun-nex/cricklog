export interface RealtimeEvent {
  id: string;
  type: 'match_update' | 'ball_update' | 'wicket' | 'boundary' | 'milestone' | 'match_start' | 'match_end' | 'notification';
  match_id: string;
  data: any;
  timestamp: Date;
  user_id?: string;
}

export interface MatchUpdateEvent {
  match_id: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  current_innings?: string;
  current_score?: string;
  current_overs?: string;
  target?: number;
  required_runs?: number;
  required_balls?: number;
  run_rate?: number;
  required_run_rate?: number;
}

export interface BallUpdateEvent {
  match_id: string;
  innings_id: string;
  over: number;
  ball: number;
  runs: number;
  is_wicket: boolean;
  wicket_type?: string;
  batsman: string;
  bowler: string;
  total_runs: number;
  total_wickets: number;
  total_overs: number;
  current_score: string;
  ball_summary: string;
}

export interface WicketEvent {
  match_id: string;
  innings_id: string;
  batsman: string;
  bowler: string;
  wicket_type: string;
  over: number;
  ball: number;
  total_wickets: number;
  partnership_runs?: number;
  partnership_balls?: number;
}

export interface BoundaryEvent {
  match_id: string;
  innings_id: string;
  batsman: string;
  bowler: string;
  runs: number;
  boundary_type: 'four' | 'six';
  over: number;
  ball: number;
  total_runs: number;
}

export interface MilestoneEvent {
  match_id: string;
  innings_id: string;
  player: string;
  milestone_type: 'fifty' | 'century' | 'double_century' | 'five_wickets' | 'ten_wickets';
  runs?: number;
  wickets?: number;
  balls?: number;
  over: number;
  ball: number;
}

export interface NotificationEvent {
  id: string;
  user_id?: string;
  type: 'match_start' | 'match_end' | 'wicket' | 'boundary' | 'milestone' | 'general';
  title: string;
  message: string;
  match_id?: string;
  data?: any;
  timestamp: Date;
  read: boolean;
}

export interface LiveMatchData {
  match_id: string;
  match_name: string;
  team1_name: string;
  team2_name: string;
  status: string;
  current_innings?: {
    team_name: string;
    innings_number: number;
    total_runs: number;
    total_wickets: number;
    total_overs: number;
    current_over: number;
    current_ball: number;
    current_batsman: string;
    current_bowler: string;
    run_rate: number;
    required_run_rate?: number;
  };
  team1_score?: string;
  team2_score?: string;
  target?: number;
  required_runs?: number;
  required_balls?: number;
  last_ball?: {
    runs: number;
    is_wicket: boolean;
    description: string;
  };
  recent_balls: Array<{
    over: number;
    ball: number;
    runs: number;
    is_wicket: boolean;
    description: string;
  }>;
}

export interface WebSocketConnection {
  id: string;
  socket_id: string;
  user_id?: string;
  match_id?: string;
  connected_at: Date;
  last_activity: Date;
  subscriptions: string[];
}

export interface RealtimeStats {
  total_connections: number;
  active_matches: number;
  events_sent: number;
  events_per_second: number;
  top_matches: Array<{
    match_id: string;
    connections: number;
    events: number;
  }>;
}

export interface MatchSubscription {
  match_id: string;
  user_id?: string;
  socket_id: string;
  subscribed_at: Date;
  event_types: string[];
}

export interface RealtimeConfig {
  max_connections_per_user: number;
  max_events_per_second: number;
  event_retention_hours: number;
  enable_notifications: boolean;
  enable_analytics: boolean;
  heartbeat_interval: number;
  connection_timeout: number;
}
