'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

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
    <main className="min-h-screen bg-gradient-to-br from-cricket-green to-primary-500 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏏 Cricklog
          </h1>
          <p className="text-gray-600 mb-6">
            Cricket Match Scoring Application
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Frontend Status</h3>
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Connected to Vercel</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Backend Status</h3>
              <div className="flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected to Vercel' : 'Testing connection...'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={testConnection}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Test Backend Connection
              </button>
              
                  <div className="space-y-3">
                    <a
                      href="/teams"
                      className="w-full bg-white text-primary-600 py-2 px-4 rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors block text-center"
                    >
                      🏏 Manage Teams
                    </a>
                    <a
                      href="/matches"
                      className="w-full bg-white text-primary-600 py-2 px-4 rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors block text-center"
                    >
                      🏆 Manage Matches
                    </a>
                    <a
                      href="/statistics"
                      className="w-full bg-white text-primary-600 py-2 px-4 rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors block text-center"
                    >
                      📊 View Statistics
                    </a>
                    <a
                      href="/history"
                      className="w-full bg-white text-primary-600 py-2 px-4 rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors block text-center"
                    >
                      📈 Match History
                    </a>
                    <a
                      href="/realtime"
                      className="w-full bg-white text-primary-600 py-2 px-4 rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors block text-center"
                    >
                      ⚡ Real-time Dashboard
                    </a>
                  </div>
            </div>

            {isAuthenticated && user && (
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">Welcome, {user.full_name}!</p>
                    <p className="text-white/70 text-sm">Role: {user.role}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {!isAuthenticated && (
              <div className="mt-6 space-y-3">
                <a
                  href="/auth/login"
                  className="w-full bg-white text-primary-600 py-2 px-4 rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors block text-center"
                >
                  🔐 Sign In
                </a>
                <a
                  href="/auth/register"
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors block text-center"
                >
                  📝 Sign Up
                </a>
              </div>
            )}

            <div className="text-xs text-gray-500 mt-4">
              <p>API URL: https://cricklog-2dk4.vercel.app</p>
              <p>App URL: https://cricklog.vercel.app</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}