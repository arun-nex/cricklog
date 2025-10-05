'use client'

import { useState } from 'react'

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)

  const testConnection = async () => {
    try {
      // Use the correct backend URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://cricklog-2dk4.vercel.app'
      const response = await fetch(`${apiUrl}/health`)
      if (response.ok) {
        setIsConnected(true)
      }
    } catch (error) {
      console.error('Connection test failed:', error)
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
                  {isConnected ? 'Connected to Railway' : 'Testing connection...'}
                </span>
              </div>
            </div>

            <button
              onClick={testConnection}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Test Backend Connection
            </button>

            <div className="text-xs text-gray-500 mt-4">
              <p>API URL: {process.env.NEXT_PUBLIC_API_URL || 'https://cricklog-2dk4.vercel.app'}</p>
              <p>App URL: {process.env.NEXT_PUBLIC_APP_URL || 'https://cricklog.vercel.app'}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
