'use client'

import { ReactNode, useState } from 'react'

interface MobileMenuProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function MobileMenu({ children, isOpen, onClose, className = '' }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

interface MobileBottomSheetProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
  className?: string
}

export function MobileBottomSheet({ 
  children, 
  isOpen, 
  onClose, 
  title, 
  className = '' 
}: MobileBottomSheetProps) {
  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6">
          {/* Handle */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          {title && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="overflow-y-auto max-h-[60vh]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

interface MobileTabBarProps {
  tabs: Array<{
    id: string
    label: string
    icon: string
    active?: boolean
    onClick: () => void
  }>
  className?: string
}

export function MobileTabBar({ tabs, className = '' }: MobileTabBarProps) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 ${className}`}>
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={tab.onClick}
            className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors ${
              tab.active 
                ? 'text-primary-600 bg-primary-50' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-2xl mb-1">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

interface MobileCardProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function MobileCard({ children, onClick, className = '' }: MobileCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-4 ${
        onClick ? 'cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface MobileListProps {
  items: Array<{
    id: string
    title: string
    subtitle?: string
    icon?: string
    rightContent?: ReactNode
    onClick?: () => void
  }>
  className?: string
}

export function MobileList({ items, className = '' }: MobileListProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <MobileCard
          key={item.id}
          onClick={item.onClick}
          className="flex items-center space-x-4"
        >
          {item.icon && (
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-lg">{item.icon}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 font-medium truncate">{item.title}</h3>
            {item.subtitle && (
              <p className="text-gray-500 text-sm truncate">{item.subtitle}</p>
            )}
          </div>
          {item.rightContent && (
            <div className="flex-shrink-0">
              {item.rightContent}
            </div>
          )}
        </MobileCard>
      ))}
    </div>
  )
}

interface MobileFloatingActionProps {
  icon: string
  onClick: () => void
  className?: string
}

export function MobileFloatingAction({ icon, onClick, className = '' }: MobileFloatingActionProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-20 right-4 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 hover:scale-110 z-30 ${className}`}
    >
      <span className="text-2xl">{icon}</span>
    </button>
  )
}

interface MobileSearchProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  className?: string
}

export function MobileSearch({ 
  placeholder = 'Search...', 
  value, 
  onChange, 
  onClear,
  className = '' 
}: MobileSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

interface MobilePullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
  className?: string
}

export function MobilePullToRefresh({ children, onRefresh, className = '' }: MobilePullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)
  const [pullDistance, setPullDistance] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY
    const distance = currentY - startY
    
    if (distance > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(distance, 100))
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance > 50) {
      setIsRefreshing(true)
      await onRefresh()
      setIsRefreshing(false)
    }
    setPullDistance(0)
  }

  return (
    <div 
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pullDistance > 0 && (
        <div 
          className="absolute top-0 left-0 right-0 bg-primary-600 text-white text-center py-2 z-10"
          style={{ transform: `translateY(${Math.min(pullDistance - 50, 0)}px)` }}
        >
          {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
        </div>
      )}
      {children}
    </div>
  )
}
