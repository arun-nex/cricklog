'use client'

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : '' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  className = '' 
}: StatCardProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400'
  }

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→'
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">{icon}</span>
            </div>
          )}
          <div>
            <h3 className="text-white/70 text-sm font-medium">{title}</h3>
            {subtitle && <p className="text-white/50 text-xs">{subtitle}</p>}
          </div>
        </div>
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 ${trendColors[trend]}`}>
            <span className="text-sm">{trendIcons[trend]}</span>
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </Card>
  )
}

interface ActionCardProps {
  title: string
  description: string
  icon: string
  action: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  className?: string
}

export function ActionCard({ 
  title, 
  description, 
  icon, 
  action, 
  onClick, 
  variant = 'primary',
  className = '' 
}: ActionCardProps) {
  const variants = {
    primary: 'hover:bg-primary-500/20 border-primary-500/30',
    secondary: 'hover:bg-gray-500/20 border-gray-500/30',
    success: 'hover:bg-green-500/20 border-green-500/30',
    warning: 'hover:bg-yellow-500/20 border-yellow-500/30',
    danger: 'hover:bg-red-500/20 border-red-500/30'
  }

  return (
    <Card 
      className={`p-6 cursor-pointer group ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
          <p className="text-white/70 text-sm mb-4">{description}</p>
          <div className="text-primary-300 font-medium text-sm group-hover:text-primary-200 transition-colors">
            {action} →
          </div>
        </div>
      </div>
    </Card>
  )
}

interface ListCardProps {
  title: string
  items: Array<{
    id: string
    title: string
    subtitle?: string
    value?: string
    status?: 'active' | 'inactive' | 'pending' | 'completed'
    onClick?: () => void
  }>
  emptyMessage?: string
  className?: string
}

export function ListCard({ 
  title, 
  items, 
  emptyMessage = 'No items found', 
  className = '' 
}: ListCardProps) {
  const statusColors = {
    active: 'bg-green-500/20 text-green-300',
    inactive: 'bg-gray-500/20 text-gray-300',
    pending: 'bg-yellow-500/20 text-yellow-300',
    completed: 'bg-blue-500/20 text-blue-300'
  }

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-white font-semibold text-lg mb-4">{title}</h3>
      
      {items.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-white/70">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors ${
                item.onClick ? 'cursor-pointer' : ''
              }`}
              onClick={item.onClick}
            >
              <div className="flex-1">
                <h4 className="text-white font-medium">{item.title}</h4>
                {item.subtitle && (
                  <p className="text-white/70 text-sm">{item.subtitle}</p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                {item.value && (
                  <span className="text-white/70 text-sm">{item.value}</span>
                )}
                {item.status && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

interface ModalCardProps {
  title: string
  children: ReactNode
  onClose: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function ModalCard({ 
  title, 
  children, 
  onClose, 
  size = 'md', 
  className = '' 
}: ModalCardProps) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-2xl w-full ${sizes[size]} shadow-2xl ${className}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
