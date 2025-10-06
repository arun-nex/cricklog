'use client'

import { useState, useEffect, useRef } from 'react'
import { RealtimeStats, WebSocketConnection, RealtimeEvent } from '@/types/Realtime'
import { io, Socket } from 'socket.io-client'

export default function RealtimePage() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [stats, setStats] = useState<RealtimeStats | null>(null)
  const [connections, setConnections] = useState<WebSocketConnection[]>([])
  const [events, setEvents] = useState<RealtimeEvent[]>([])
  const [selectedMatch, setSelectedMatch] = useState<string>('')
  const [notifications, setNotifications] = useState<RealtimeEvent[]>([])
  const [loading, setLoading] = useState(true)

  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    initializeSocket()
    fetchStats()
    fetchConnections()
    fetchEvents()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  const initializeSocket = () => {
    const newSocket = io('https://cricklog-2dk4.vercel.app', {
      transports: ['websocket', 'polling'],
      autoConnect: true
    })

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server')
      setConnected(true)
      setSocket(newSocket)
      socketRef.current = newSocket
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
      setConnected(false)
    })

    newSocket.on('match_update', (data: RealtimeEvent) => {
      console.log('Match update received:', data)
      setEvents(prev => [data, ...prev.slice(0, 99)]) // Keep last 100 events
    })

    newSocket.on('ball_update', (data: RealtimeEvent) => {
      console.log('Ball update received:', data)
      setEvents(prev => [data, ...prev.slice(0, 99)])
    })

    newSocket.on('wicket', (data: RealtimeEvent) => {
      console.log('Wicket event received:', data)
      setEvents(prev => [data, ...prev.slice(0, 99)])
      setNotifications(prev => [data, ...prev.slice(0, 9)]) // Keep last 10 notifications
    })

    newSocket.on('boundary', (data: RealtimeEvent) => {
      console.log('Boundary event received:', data)
      setEvents(prev => [data, ...prev.slice(0, 99)])
    })

    newSocket.on('milestone', (data: RealtimeEvent) => {
      console.log('Milestone event received:', data)
      setEvents(prev => [data, ...prev.slice(0, 99)])
      setNotifications(prev => [data, ...prev.slice(0, 9)])
    })

    newSocket.on('notification', (data: RealtimeEvent) => {
      console.log('Notification received:', data)
      setNotifications(prev => [data, ...prev.slice(0, 9)])
    })

    newSocket.on('heartbeat', (data: any) => {
      console.log('Heartbeat received:', data)
    })

    newSocket.on('subscription_confirmed', (data: any) => {
      console.log('Subscription confirmed:', data)
    })

    newSocket.on('unsubscription_confirmed', (data: any) => {
      console.log('Unsubscription confirmed:', data)
    })

    newSocket.on('user_identified', (data: any) => {
      console.log('User identified:', data)
    })

    newSocket.on('pong', () => {
      console.log('Pong received')
    })
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('https://cricklog-2dk4.vercel.app/api/realtime/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching realtime stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchConnections = async () => {
    try {
      const response = await fetch('https://cricklog-2dk4.vercel.app/api/realtime/connections')
      const data = await response.json()
      
      if (data.success) {
        setConnections(data.data)
      }
    } catch (error) {
      console.error('Error fetching connections:', error)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch(`https://cricklog-2dk4.vercel.app/api/realtime/events${selectedMatch ? `/${selectedMatch}` : ''}`)
      const data = await response.json()
      
      if (data.success) {
        setEvents(data.data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const subscribeToMatch = (matchId: string) => {
    if (socket) {
      socket.emit('subscribe_match', { match_id: matchId })
      setSelectedMatch(matchId)
    }
  }

  const unsubscribeFromMatch = (matchId: string) => {
    if (socket) {
      socket.emit('unsubscribe_match', { match_id: matchId })
      setSelectedMatch('')
    }
  }

  const identifyUser = (userId: string) => {
    if (socket) {
      socket.emit('identify_user', { user_id: userId })
    }
  }

  const sendPing = () => {
    if (socket) {
      socket.emit('ping')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading real-time dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Real-time Dashboard
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            Live WebSocket connections, real-time events, and match updates
          </p>
        </div>

        {/* Connection Status */}
        <div className="mb-8">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
            connected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            <div className={`w-3 h-3 rounded-full mr-2 ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            {connected ? 'Connected to WebSocket' : 'Disconnected from WebSocket'}
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-primary-300 mb-2">{stats.total_connections}</div>
              <div className="text-white/70">Total Connections</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-green-300 mb-2">{stats.active_matches}</div>
              <div className="text-white/70">Active Matches</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-blue-300 mb-2">{stats.events_sent}</div>
              <div className="text-white/70">Events Sent</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{stats.events_per_second}</div>
              <div className="text-white/70">Events/Second</div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">WebSocket Controls</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">Subscribe to Match</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter match ID"
                  className="flex-1 px-4 py-2 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
                  onChange={(e) => setSelectedMatch(e.target.value)}
                />
                <button
                  onClick={() => subscribeToMatch(selectedMatch)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">User ID</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter user ID"
                  className="flex-1 px-4 py-2 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
                  onChange={(e) => identifyUser(e.target.value)}
                />
                <button
                  onClick={() => identifyUser('test-user')}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Identify
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">Connection Test</label>
              <button
                onClick={sendPing}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Send Ping
              </button>
            </div>
          </div>
        </div>

        {/* Top Matches */}
        {stats && stats.top_matches.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Top Active Matches</h3>
            <div className="space-y-3">
              {stats.top_matches.map((match, index) => (
                <div key={match.match_id} className="flex justify-between items-center bg-white/5 rounded-xl p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-primary-300">#{index + 1}</div>
                    <div>
                      <div className="text-white font-semibold">Match {match.match_id}</div>
                      <div className="text-white/70 text-sm">{match.events} events</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{match.connections} connections</div>
                    <div className="text-white/70 text-sm">subscribers</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Recent Events</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {events.slice(0, 20).map((event, index) => (
                <div key={event.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-white font-semibold capitalize">{event.type.replace('_', ' ')}</div>
                    <div className="text-white/70 text-sm">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-white/70 text-sm">Match: {event.match_id}</div>
                  <div className="text-white/60 text-xs mt-1">
                    {JSON.stringify(event.data).substring(0, 100)}...
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Notifications</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.slice(0, 10).map((notification, index) => (
                <div key={notification.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-white font-semibold capitalize">{notification.type.replace('_', ' ')}</div>
                    <div className="text-white/70 text-sm">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-white/70 text-sm">Match: {notification.match_id}</div>
                  <div className="text-white/60 text-xs mt-1">
                    {JSON.stringify(notification.data).substring(0, 100)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Connections List */}
        {connections.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Active Connections</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {connections.map((connection) => (
                <div key={connection.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-white font-semibold">{connection.socket_id}</div>
                    <div className="text-white/70 text-sm">
                      {new Date(connection.connected_at).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-white/70 text-sm">
                    User: {connection.user_id || 'Anonymous'}
                  </div>
                  <div className="text-white/70 text-sm">
                    Subscriptions: {connection.subscriptions.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
