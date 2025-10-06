'use client'

import { ReactNode } from 'react'
import Navigation from './Navigation'

interface PageLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  icon?: string
  className?: string
}

export function PageLayout({ 
  children, 
  title, 
  subtitle, 
  icon, 
  className = '' 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navigation />
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        {(title || subtitle || icon) && (
          <div className="text-center mb-12">
            {icon && (
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                <span className="text-3xl">{icon}</span>
              </div>
            )}
            {title && (
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

interface ContainerProps {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

export function Container({ children, size = 'lg', className = '' }: ContainerProps) {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none'
  }

  return (
    <div className={`container mx-auto px-4 ${sizes[size]} ${className}`}>
      {children}
    </div>
  )
}

interface GridProps {
  children: ReactNode
  cols?: 1 | 2 | 3 | 4 | 6
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Grid({ children, cols = 1, gap = 'md', className = '' }: GridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  }

  const gaps = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  }

  return (
    <div className={`grid ${gridCols[cols]} ${gaps[gap]} ${className}`}>
      {children}
    </div>
  )
}

interface FlexProps {
  children: ReactNode
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  wrap?: boolean
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Flex({ 
  children, 
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = false,
  gap = 'md',
  className = '' 
}: FlexProps) {
  const directions = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
  }

  const justifies = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }

  const aligns = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  }

  const gaps = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  return (
    <div className={`
      flex ${directions[direction]} ${justifies[justify]} ${aligns[align]} 
      ${wrap ? 'flex-wrap' : 'flex-nowrap'} ${gaps[gap]} ${className}
    `}>
      {children}
    </div>
  )
}

interface SectionProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
}

export function Section({ children, title, subtitle, className = '' }: SectionProps) {
  return (
    <section className={`mb-12 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-white/70 text-lg">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`${sizes[size]} border-2 border-white border-t-transparent rounded-full animate-spin ${className}`}></div>
  )
}

interface LoadingPageProps {
  message?: string
  className?: string
}

export function LoadingPage({ message = 'Loading...', className = '' }: LoadingPageProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-white text-xl">{message}</p>
      </div>
    </div>
  )
}

interface ErrorPageProps {
  title?: string
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function ErrorPage({ 
  title = 'Something went wrong', 
  message = 'An unexpected error occurred',
  action,
  className = '' 
}: ErrorPageProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center ${className}`}>
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-6">😵</div>
        <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
        <p className="text-white/70 text-lg mb-8">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ 
  icon = '📭', 
  title, 
  description, 
  action, 
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10 max-w-md mx-auto">
        <div className="text-6xl mb-6">{icon}</div>
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        {description && (
          <p className="text-white/70 text-lg mb-8">{description}</p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-2xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}
