'use client'

import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  children: ReactNode
  error?: string
  required?: boolean
  className?: string
}

export function FormField({ label, children, error, required, className = '' }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
}

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  min?: number
  max?: number
  step?: number
}

export function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  disabled = false, 
  className = '',
  min,
  max,
  step
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      className={`w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black placeholder-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    />
  )
}

interface TextAreaProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  rows?: number
  className?: string
}

export function TextArea({ 
  placeholder, 
  value, 
  onChange, 
  disabled = false, 
  rows = 4,
  className = '' 
}: TextAreaProps) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      rows={rows}
      className={`w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black placeholder-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed resize-vertical ${className}`}
    />
  )
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string; disabled?: boolean }>
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function Select({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  disabled = false,
  className = '' 
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option 
          key={option.value} 
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  )
}

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Checkbox({ label, checked, onChange, disabled = false, className = '' }: CheckboxProps) {
  return (
    <label className={`flex items-center space-x-3 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:opacity-50"
      />
      <span className="text-gray-700 font-medium">{label}</span>
    </label>
  )
}

interface RadioGroupProps {
  name: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string; disabled?: boolean }>
  className?: string
}

export function RadioGroup({ name, value, onChange, options, className = '' }: RadioGroupProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={option.disabled}
            className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 disabled:opacity-50"
          />
          <span className="text-gray-700 font-medium">{option.label}</span>
        </label>
      ))}
    </div>
  )
}

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
}

export function Button({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '' 
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white'
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

interface FormProps {
  children: ReactNode
  onSubmit: (e: React.FormEvent) => void
  className?: string
}

export function Form({ children, onSubmit, className = '' }: FormProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {children}
    </form>
  )
}

interface FormGridProps {
  children: ReactNode
  cols?: 1 | 2 | 3 | 4
  className?: string
}

export function FormGrid({ children, cols = 1, className = '' }: FormGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[cols]} gap-4 ${className}`}>
      {children}
    </div>
  )
}
