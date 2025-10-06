'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { PageLayout, Grid, StatCard, ActionCard, EmptyState } from '@/components/Layout'
import { Card } from '@/components/Cards'

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const testConnection = async () => {
    try {
      // Force the correct backend URL without any environment variables
      const apiUrl = 'https://cricklog-2dk4.vercel.app'
      const healthUrl = `${apiUrl}/health`
      
      console.log('🔍 Testing connection to:', healthUrl)
      console.log('🌐 Current origin:', window.location.origin)
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      })
      
      console.log('📊 Response status:', response.status)
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Response data:', data)
        setIsConnected(true)
        console.log('🎉 Backend connection successful!')
      } else {
        console.error('❌ Backend responded with status:', response.status)
        const errorText = await response.text()
        console.error('💥 Error response:', errorText)
      }
    } catch (error) {
      console.error('🚨 Connection test failed:', error)
    }
  }

  return (
    <PageLayout 
      title="🏏 Cricklog" 
      subtitle="Professional Cricket Match Scoring Application"
      icon="🏏"
    >
      {/* Status Cards */}
      <Grid cols={2} className="mb-8">
        <StatCard
          title="Frontend Status"
          value="Connected"
          icon="🌐"
          trend="up"
          trendValue="Vercel"
        />
        <StatCard
          title="Backend Status"
          value={isConnected ? "Connected" : "Testing..."}
          icon="⚡"
          trend={isConnected ? "up" : "neutral"}
          trendValue={isConnected ? "Vercel" : "Connecting..."}
        />
      </Grid>

      {/* Connection Test */}
      <Card className="p-6 mb-8">
        <div className="text-center">
          <button
            onClick={testConnection}
            className="bg-primary-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-700 transition-colors mb-4"
          >
            Test Backend Connection
          </button>
          <p className="text-white/70 text-sm">
            Click to verify API connectivity
          </p>
        </div>
      </Card>

      {/* User Status */}
      {isAuthenticated && user && (
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Welcome, {user.full_name}!</h3>
                <p className="text-white/70 capitalize">Role: {user.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Logout
            </button>
          </div>
        </Card>
      )}

      {/* Authentication Actions */}
      {!isAuthenticated && (
        <Grid cols={2} className="mb-8">
          <ActionCard
            title="Sign In"
            description="Access your account and manage your cricket data"
            icon="🔐"
            action="Sign In"
            onClick={() => window.location.href = '/auth/login'}
            variant="primary"
          />
          <ActionCard
            title="Sign Up"
            description="Create a new account to start scoring matches"
            icon="📝"
            action="Sign Up"
            onClick={() => window.location.href = '/auth/register'}
            variant="success"
          />
        </Grid>
      )}

      {/* Main Actions */}
      <Grid cols={2} className="mb-8">
        <ActionCard
          title="Manage Teams"
          description="Create teams, add players, and manage rosters"
          icon="🏏"
          action="Manage Teams"
          onClick={() => window.location.href = '/teams'}
          variant="primary"
        />
        <ActionCard
          title="Manage Matches"
          description="Schedule matches and track game progress"
          icon="🏆"
          action="Manage Matches"
          onClick={() => window.location.href = '/matches'}
          variant="success"
        />
        <ActionCard
          title="View Statistics"
          description="Analyze player performance and team statistics"
          icon="📊"
          action="View Stats"
          onClick={() => window.location.href = '/statistics'}
          variant="warning"
        />
        <ActionCard
          title="Match History"
          description="Browse historical matches and generate reports"
          icon="📈"
          action="View History"
          onClick={() => window.location.href = '/history'}
          variant="secondary"
        />
        <ActionCard
          title="Real-time Dashboard"
          description="Monitor live connections and real-time events"
          icon="⚡"
          action="Live Dashboard"
          onClick={() => window.location.href = '/realtime'}
          variant="danger"
        />
      </Grid>

      {/* System Info */}
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-white font-semibold text-lg mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/70">
            <div>
              <strong>API URL:</strong> https://cricklog-2dk4.vercel.app
            </div>
            <div>
              <strong>App URL:</strong> https://cricklog.vercel.app
            </div>
          </div>
        </div>
      </Card>
    </PageLayout>
  )
}