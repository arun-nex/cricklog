'use client'

import { ReactNode } from 'react'

interface ResponsiveProps {
  children: ReactNode
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl'
  show?: 'above' | 'below'
  className?: string
}

export function Responsive({ 
  children, 
  breakpoint = 'md', 
  show = 'above', 
  className = '' 
}: ResponsiveProps) {
  const classes = {
    sm: show === 'above' ? 'hidden sm:block' : 'block sm:hidden',
    md: show === 'above' ? 'hidden md:block' : 'block md:hidden',
    lg: show === 'above' ? 'hidden lg:block' : 'block lg:hidden',
    xl: show === 'above' ? 'hidden xl:block' : 'block xl:hidden'
  }

  return (
    <div className={`${classes[breakpoint]} ${className}`}>
      {children}
    </div>
  )
}

interface MobileOnlyProps {
  children: ReactNode
  className?: string
}

export function MobileOnly({ children, className = '' }: MobileOnlyProps) {
  return (
    <div className={`block md:hidden ${className}`}>
      {children}
    </div>
  )
}

interface DesktopOnlyProps {
  children: ReactNode
  className?: string
}

export function DesktopOnly({ children, className = '' }: DesktopOnlyProps) {
  return (
    <div className={`hidden md:block ${className}`}>
      {children}
    </div>
  )
}

interface TabletOnlyProps {
  children: ReactNode
  className?: string
}

export function TabletOnly({ children, className = '' }: TabletOnlyProps) {
  return (
    <div className={`hidden sm:block lg:hidden ${className}`}>
      {children}
    </div>
  )
}

interface ResponsiveGridProps {
  children: ReactNode
  cols?: {
    mobile?: 1 | 2
    tablet?: 1 | 2 | 3
    desktop?: 1 | 2 | 3 | 4 | 5 | 6
  }
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function ResponsiveGrid({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = '' 
}: ResponsiveGridProps) {
  const gridCols = {
    mobile: cols.mobile === 1 ? 'grid-cols-1' : 'grid-cols-2',
    tablet: cols.tablet === 1 ? 'grid-cols-1' : cols.tablet === 2 ? 'grid-cols-2' : 'grid-cols-3',
    desktop: cols.desktop === 1 ? 'grid-cols-1' : 
             cols.desktop === 2 ? 'grid-cols-2' : 
             cols.desktop === 3 ? 'grid-cols-3' :
             cols.desktop === 4 ? 'grid-cols-4' :
             cols.desktop === 5 ? 'grid-cols-5' : 'grid-cols-6'
  }

  const gaps = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  return (
    <div className={`
      grid ${gridCols.mobile} sm:${gridCols.tablet} lg:${gridCols.desktop} 
      ${gaps[gap]} ${className}
    `}>
      {children}
    </div>
  )
}

interface ResponsiveTextProps {
  children: ReactNode
  size?: {
    mobile?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
    tablet?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
    desktop?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  }
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  className?: string
}

export function ResponsiveText({ 
  children, 
  size = { mobile: 'base', tablet: 'lg', desktop: 'xl' },
  weight = 'normal',
  className = '' 
}: ResponsiveTextProps) {
  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  }

  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }

  return (
    <div className={`
      ${textSizes[size.mobile || 'base']} 
      sm:${textSizes[size.tablet || 'lg']} 
      lg:${textSizes[size.desktop || 'xl']} 
      ${weights[weight]} 
      ${className}
    `}>
      {children}
    </div>
  )
}

interface ResponsiveSpacingProps {
  children: ReactNode
  padding?: {
    mobile?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    tablet?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    desktop?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  }
  margin?: {
    mobile?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    tablet?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    desktop?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  }
  className?: string
}

export function ResponsiveSpacing({ 
  children, 
  padding = { mobile: 'md', tablet: 'lg', desktop: 'xl' },
  margin = { mobile: 'none', tablet: 'none', desktop: 'none' },
  className = '' 
}: ResponsiveSpacingProps) {
  const paddings = {
    none: 'p-0',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  }

  const margins = {
    none: 'm-0',
    sm: 'm-2',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8'
  }

  return (
    <div className={`
      ${paddings[padding.mobile || 'md']} 
      sm:${paddings[padding.tablet || 'lg']} 
      lg:${paddings[padding.desktop || 'xl']}
      ${margins[margin.mobile || 'none']} 
      sm:${margins[margin.tablet || 'none']} 
      lg:${margins[margin.desktop || 'none']}
      ${className}
    `}>
      {children}
    </div>
  )
}

interface ResponsiveImageProps {
  src: string
  alt: string
  sizes?: {
    mobile?: 'sm' | 'md' | 'lg' | 'xl'
    tablet?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    desktop?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  }
  className?: string
}

export function ResponsiveImage({ 
  src, 
  alt, 
  sizes = { mobile: 'md', tablet: 'lg', desktop: 'xl' },
  className = '' 
}: ResponsiveImageProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
    '2xl': 'w-48 h-48',
    '3xl': 'w-64 h-64'
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`
        ${sizeClasses[sizes.mobile || 'md']} 
        sm:${sizeClasses[sizes.tablet || 'lg']} 
        lg:${sizeClasses[sizes.desktop || 'xl']} 
        object-cover rounded-lg ${className}
      `}
    />
  )
}

interface ResponsiveContainerProps {
  children: ReactNode
  maxWidth?: {
    mobile?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    tablet?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
    desktop?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'
  }
  className?: string
}

export function ResponsiveContainer({ 
  children, 
  maxWidth = { mobile: 'full', tablet: 'xl', desktop: '6xl' },
  className = '' 
}: ResponsiveContainerProps) {
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div className={`
      mx-auto px-4 
      ${maxWidths[maxWidth.mobile || 'full']} 
      sm:${maxWidths[maxWidth.tablet || 'xl']} 
      lg:${maxWidths[maxWidth.desktop || '6xl']} 
      ${className}
    `}>
      {children}
    </div>
  )
}
