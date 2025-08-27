'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ToolOption } from '@/types'

interface ToolOptionsProps {
  options: ToolOption[]
  onOptionsChange: (options: Record<string, any>) => void
  className?: string
}

export default function ToolOptions({ options, onOptionsChange, className = '' }: ToolOptionsProps) {
  const [currentOptions, setCurrentOptions] = useState<Record<string, any>>({})

  useEffect(() => {
    // Initialize options with default values
    const initialOptions: Record<string, any> = {}
    options.forEach(option => {
      initialOptions[option.id] = option.defaultValue
    })
    setCurrentOptions(initialOptions)
    onOptionsChange(initialOptions)
  }, [options, onOptionsChange])

  const handleOptionChange = (optionId: string, value: any) => {
    const newOptions = { ...currentOptions, [optionId]: value }
    setCurrentOptions(newOptions)
    onOptionsChange(newOptions)
  }

  const renderOption = (option: ToolOption) => {
    switch (option.type) {
      case 'select':
        return (
          <div key={option.id} className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {option.name}
            </label>
            <select
              value={currentOptions[option.id] || option.defaultValue}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              {option.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1).replace(/-/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        )

      case 'slider':
        return (
          <div key={option.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                {option.name}
              </label>
              <span className="text-sm text-muted-foreground">
                {currentOptions[option.id] || option.defaultValue}
              </span>
            </div>
            <input
              type="range"
              min={option.min || 0}
              max={option.max || 100}
              step={option.step || 1}
              value={currentOptions[option.id] || option.defaultValue}
              onChange={(e) => handleOptionChange(option.id, Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{option.min || 0}</span>
              <span>{option.max || 100}</span>
            </div>
          </div>
        )

      case 'toggle':
        return (
          <div key={option.id} className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {option.name}
            </label>
            <button
              type="button"
              onClick={() => handleOptionChange(option.id, !(currentOptions[option.id] ?? option.defaultValue))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                currentOptions[option.id] ?? option.defaultValue
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  currentOptions[option.id] ?? option.defaultValue
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        )

      case 'input':
        return (
          <div key={option.id} className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {option.name}
            </label>
            <input
              type="text"
              placeholder={option.placeholder || ''}
              value={currentOptions[option.id] || option.defaultValue}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        )

      default:
        return null
    }
  }

  if (!options || options.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-4 ${className}`}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Tool Options</h3>
      <div className="space-y-4">
        {options.map(renderOption)}
      </div>
    </motion.div>
  )
}
