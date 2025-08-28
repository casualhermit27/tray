'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Search } from 'lucide-react'
import Image from 'next/image'
import { 
  IconFileText, 
  IconFiles, 
  IconFileStack,
  IconTable,
  IconDatabase,
  IconChartBar,
  IconPhoto,
  IconVideo,
  IconScissors,
  IconWorld,
  IconCode,
  IconLayout,

  IconLock,
  IconShield,
  IconKey,
  IconSignature,
  IconEdit,
  IconWriting,
  IconSettings,
  IconPuzzle,
  IconTransform
} from '@tabler/icons-react'
import { useAppStore } from '@/store'
import { trays } from '@/data/trays'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const getTrayIcon = (trayId: string) => {
  const iconProps = { size: 24, className: "text-foreground" }
  
  switch (trayId) {
    case 'documents': return <IconFileText {...iconProps} />
    case 'data': return <IconTable {...iconProps} />
    case 'media': return <IconPhoto {...iconProps} />
    case 'web': return <IconWorld {...iconProps} />

    case 'security': return <IconLock {...iconProps} />
    case 'e-signature': return <IconSignature {...iconProps} />
    case 'advanced': return <IconSettings {...iconProps} />
    default: return <IconFileText {...iconProps} />
  }
}

const getToolIcon = (toolId: string, trayId: string) => {
  const iconProps = { size: 20, className: "text-muted-foreground group-hover:text-foreground" }
  
  // Documents
  if (trayId === 'documents') {
    switch (toolId) {
      case 'pdf-merge': return <IconFiles {...iconProps} />
      case 'pdf-compress': return <IconFileStack {...iconProps} />
      case 'pdf-extract': return <IconScissors {...iconProps} />
      case 'pdf-to-office': return <IconFileText {...iconProps} />
      default: return <IconFileText {...iconProps} />
    }
  }
  
  // Data
  if (trayId === 'data') {
    switch (toolId) {
      case 'excel-to-csv': return <IconTable {...iconProps} />
      case 'csv-to-excel': return <IconDatabase {...iconProps} />
      case 'json-formatter': return <IconCode {...iconProps} />
      case 'excel-cleaner': return <IconChartBar {...iconProps} />
      case 'sql-formatter': return <IconDatabase {...iconProps} />
      default: return <IconTable {...iconProps} />
    }
  }
  
  // Media
  if (trayId === 'media') {
    switch (toolId) {
      case 'image-compression': return <IconPhoto {...iconProps} />
      case 'format-conversion': return <IconTransform {...iconProps} />
      case 'ocr-extraction': return <IconFileText {...iconProps} />
      case 'background-removal': return <IconScissors {...iconProps} />
      default: return <IconPhoto {...iconProps} />
    }
  }
  
  // Web
  if (trayId === 'web') {
    switch (toolId) {
      case 'html-to-markdown': return <IconCode {...iconProps} />
      case 'text-extraction': return <IconFileText {...iconProps} />
      case 'screenshot-tool': return <IconPhoto {...iconProps} />
      default: return <IconWorld {...iconProps} />
    }
  }
  
  // Security
  if (trayId === 'security') {
    switch (toolId) {
      case 'pdf-password-remove': return <IconKey {...iconProps} />
      case 'pdf-password-protect': return <IconLock {...iconProps} />
      case 'pdf-encrypt': return <IconShield {...iconProps} />
      default: return <IconLock {...iconProps} />
    }
  }
  
  // E-Signature
  if (trayId === 'e-signature') {
    switch (toolId) {
      case 'digital-signature': return <IconSignature {...iconProps} />
      case 'form-filling': return <IconEdit {...iconProps} />
      case 'signature-verification': return <IconWriting {...iconProps} />
      default: return <IconSignature {...iconProps} />
    }
  }
  
  // Advanced
  if (trayId === 'advanced') {
    switch (toolId) {
      case 'folder-processing': return <IconFiles {...iconProps} />
      case 'workflow-automation': return <IconPuzzle {...iconProps} />
      case 'batch-conversion': return <IconTransform {...iconProps} />
      default: return <IconSettings {...iconProps} />
    }
  }
  
  return <IconFileText {...iconProps} />
}

export default function LandingPage() {
  const { setView, setCurrentTrayId, setCurrentToolId } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleGetStarted = () => {
    setView('dashboard')
  }

  const filteredTrays = trays.filter(tray =>
    tray.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tray.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-6 pt-40 pb-8 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl font-sans font-semibold text-foreground mb-6 leading-tight"
          >
            Simple file processing
            <span className="block text-muted-foreground font-normal">
              for everything
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Clean, minimal tools for documents, data, media, web, security, e-signature, and advanced processing tasks.
            <span className="font-medium text-foreground">{trays.reduce((total, tray) => total + tray.tools.length, 0)} powerful tools</span> to handle all your file processing needs.
          </motion.p>
          
          <motion.button
            variants={itemVariants}
            onClick={handleGetStarted}
            className="btn-ghost text-lg px-8 py-4 group"
          >
            Start Free
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </section>

      {/* Search Section */}
      <section className="px-6 py-1 flex items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-2xl mx-auto w-full"
        >
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full pl-12 pr-4 py-4 text-lg"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Simple Pricing Section */}
      <section className="px-6 py-16 bg-muted/30">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-heading font-semibold text-foreground mb-4"
          >
            Simple, transparent pricing
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Everything available, just usage and file size limits
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto"
          >
            {/* Free Plan */}
            <div className="bg-background border border-border rounded-xl p-6 text-left">
              <h3 className="text-xl font-semibold text-foreground mb-2">Free Plan</h3>
              <div className="text-3xl font-bold text-foreground mb-4">$0</div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li>• 5 tasks per day</li>
                <li>• 20MB file limit</li>
                <li>• All tools available</li>
                <li>• Files deleted instantly</li>
                <li>• Non-intrusive ads</li>
              </ul>
              <button className="w-full btn-ghost">Get Started Free</button>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-6 text-left">
              <h3 className="text-xl font-semibold mb-2">Pro Plan</h3>
              <div className="text-3xl font-bold mb-4">$4.99/month</div>
              <ul className="space-y-2 text-sm opacity-90 mb-6">
                <li>• 50 tasks per day</li>
                <li>• 200MB file limit</li>
                <li>• Priority processing</li>
                <li>• No ads</li>
                <li>• All features unlocked</li>
              </ul>
              <button className="w-full bg-white text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                Start Pro Trial
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Tray Categories */}
      <section className="px-6 pt-8 pb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-heading font-semibold text-foreground text-center mb-8"
          >
            What can you do?
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto"
          >
            Choose from <span className="font-medium text-foreground">
              {trays.reduce((total, tray) => total + tray.tools.length, 0)} tools
            </span> across {trays.length} categories
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <button
              onClick={() => setView('tool-showcase')}
              className="btn-ghost text-base px-6 py-3 group"
            >
              View All Tools
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
          
          {/* Tray Layout */}
          <div className="space-y-16">
            {filteredTrays.map((tray, index) => {
              return (
                <motion.div
                  key={tray.id}
                  variants={itemVariants}
                  className="w-full"
                >
                  {/* Tray Title */}
                  <div className="text-center mb-8">
                    <h3 className="text-4xl font-sans font-semibold text-foreground mb-4">
                      {tray.name}
                    </h3>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                      Clean, minimal tools for documents, data, media, web, security, e-signature, and advanced processing tasks.
                    </p>
                  </div>
                  
                  {/* Tools Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {tray.tools.map((tool) => (
                      <motion.div
                        key={tool.id}
                        whileHover={{ y: -2 }}
                        className="group cursor-pointer"
                        onClick={() => {
                          setCurrentTrayId(tray.id)
                          setCurrentToolId(tool.id)
                          router.push(`/${tool.id}`)
                        }}
                      >
                        <div className="bg-muted/30 hover:bg-muted/50 border border-border hover:border-foreground/20 rounded-xl p-6 transition-all duration-200 h-full">
                          <div className="flex items-start space-x-4">
                            {/* Tool Icon */}
                            <div className="flex-shrink-0 p-3 rounded-lg bg-background border border-border">
                              {getToolIcon(tool.id, tray.id)}
                            </div>
                            
                            {/* Tool Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold text-foreground group-hover:text-foreground/80 transition-colors mb-2">
                                {tool.name}
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>
    </div>
  )
}
