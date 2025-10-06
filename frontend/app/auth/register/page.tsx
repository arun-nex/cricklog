'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    confirm_password: '',
    role: 'viewer' as 'scorer' | 'viewer'
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)

    try {
      const result = await register(formData)
      
      if (result.success) {
        router.push('/')
      } else {
        setError(result.message || 'Registration failed')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
            <span className="text-3xl">🏏</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Cricklog</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all text-lg bg-white text-black placeholder-gray-600 font-medium"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all text-lg bg-white text-black placeholder-gray-600 font-medium"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all text-lg bg-white text-black placeholder-gray-600 font-medium"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
            >
              <option value="viewer">Viewer - Watch matches and view statistics</option>
              <option value="scorer">Scorer - Create matches and score games</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all text-lg bg-white text-black placeholder-gray-600 font-medium"
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all text-lg bg-white text-black placeholder-gray-600 font-medium"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/auth/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
