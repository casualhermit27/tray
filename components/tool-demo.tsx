'use client'

import { motion } from 'framer-motion'
import { Upload, FileText, BarChart3, Image, Globe, Bot } from 'lucide-react'

interface ToolDemoProps {
  type: 'document' | 'data' | 'media' | 'web' | 'ai'
  title: string
  description: string
  icon: string
}

const iconMap = {
  document: FileText,
  data: BarChart3,
  media: Image,
  web: Globe,
  ai: Bot
}

export function ToolDemo({ type, title, description, icon }: ToolDemoProps) {
  const IconComponent = iconMap[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card max-w-md mx-auto"
    >
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>
        
        {/* Demo Upload Zone */}
        <div className="border-2 border-dashed border-border rounded-xl p-8 mb-6">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Drop your {type} files here
          </p>
        </div>

        {/* Demo Options */}
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Quality:</span>
            <select className="border border-border rounded-lg px-3 py-1 text-xs">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Format:</span>
            <select className="border border-border rounded-lg px-3 py-1 text-xs">
              <option>Auto</option>
              <option>Custom</option>
            </select>
          </div>
        </div>

        {/* Demo Process Button */}
        <button className="btn-ghost w-full mt-6">
          Process {type} files
        </button>
      </div>
    </motion.div>
  )
}
