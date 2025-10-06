'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthResponse, LoginRequest, RegisterRequest, UpdateProfileRequest, AuthContextType } from '@/types/Auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token in localStorage
    const storedToken = localStorage.getItem('cricklog_token')
    const storedUser = localStorage.getItem('cricklog_user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      verifyToken()
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('https://cricklog-2dk4.vercel.app/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          return true
        }
      }
      
      // Token is invalid, clear storage
      localStorage.removeItem('cricklog_token')
      localStorage.removeItem('cricklog_user')
      setToken(null)
      setUser(null)
      return false
    } catch (error) {
      console.error('Error verifying token:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string, remember_me = false): Promise<AuthResponse> => {
    try {
      setIsLoading(true)
      const response = await fetch('https://cricklog-2dk4.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, remember_me })
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.user && data.token) {
        setUser(data.user)
        setToken(data.token)
        
        // Store in localStorage
        localStorage.setItem('cricklog_token', data.token)
        localStorage.setItem('cricklog_user', JSON.stringify(data.user))
        
        if (data.refresh_token) {
          localStorage.setItem('cricklog_refresh_token', data.refresh_token)
        }
      }

      return data
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'Login failed. Please try again.'
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true)
      const response = await fetch('https://cricklog-2dk4.vercel.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result: AuthResponse = await response.json()

      if (result.success && result.user && result.token) {
        setUser(result.user)
        setToken(result.token)
        
        // Store in localStorage
        localStorage.setItem('cricklog_token', result.token)
        localStorage.setItem('cricklog_user', JSON.stringify(result.user))
        
        if (result.refresh_token) {
          localStorage.setItem('cricklog_refresh_token', result.refresh_token)
        }
      }

      return result
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      if (token) {
        await fetch('https://cricklog-2dk4.vercel.app/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state and storage
      setUser(null)
      setToken(null)
      localStorage.removeItem('cricklog_token')
      localStorage.removeItem('cricklog_user')
      localStorage.removeItem('cricklog_refresh_token')
    }
  }

  const updateProfile = async (data: UpdateProfileRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true)
      const response = await fetch('https://cricklog-2dk4.vercel.app/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result: AuthResponse = await response.json()

      if (result.success && result.user) {
        setUser(result.user)
        localStorage.setItem('cricklog_user', JSON.stringify(result.user))
      }

      return result
    } catch (error) {
      console.error('Profile update error:', error)
      return {
        success: false,
        message: 'Profile update failed. Please try again.'
      }
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async (): Promise<AuthResponse> => {
    try {
      const refreshToken = localStorage.getItem('cricklog_refresh_token')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await fetch('https://cricklog-2dk4.vercel.app/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.token) {
        setToken(data.token)
        localStorage.setItem('cricklog_token', data.token)
        return data
      }

      throw new Error('Token refresh failed')
    } catch (error) {
      console.error('Token refresh error:', error)
      // If refresh fails, logout user
      await logout()
      return {
        success: false,
        message: 'Session expired. Please login again.'
      }
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    refreshToken,
    verifyToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
