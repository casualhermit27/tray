'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Search } from 'lucide-react'
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const categoryColors = {
  documents: 'bg-blue-50 border-blue-200 text-blue-700',
  data: 'bg-green-50 border-green-200 text-green-700',
  media: 'bg-purple-50 border-purple-200 text-purple-700',
  web: 'bg-orange-50 border-orange-200 text-orange-700',
  ai: 'bg-pink-50 border-pink-200 text-pink-700',
  security: 'bg-red-50 border-red-200 text-red-700',
  'e-signature': 'bg-indigo-50 border-indigo-200 text-indigo-700',
  advanced: 'bg-yellow-50 border-yellow-200 text-yellow-700'
}

const getToolIcon = (toolId: string, trayId: string) => {
  const iconProps = { size: 20, className: "text-foreground" }
  
  // Documents
  if (trayId === 'documents') {
    switch (toolId) {
      case 'pdf-merge': return <IconFiles {...iconProps} />
      case 'pdf-split': return <IconScissors {...iconProps} />
      case 'pdf-compress': return <IconFileStack {...iconProps} />
      case 'pdf-unlock': return <IconKey {...iconProps} />
      case 'pdf-protect': return <IconLock {...iconProps} />
      case 'pdf-rotate': return <IconTransform {...iconProps} />
      case 'pdf-reorder': return <IconFileStack {...iconProps} />
      case 'pdf-extract': return <IconScissors {...iconProps} />
      case 'pdf-watermark': return <IconEdit {...iconProps} />
      case 'pdf-edit': return <IconEdit {...iconProps} />
      case 'pdf-e-sign': return <IconSignature {...iconProps} />
      case 'pdf-to-word': return <IconFileText {...iconProps} />
      case 'word-to-pdf': return <IconFileText {...iconProps} />
      case 'pdf-to-excel': return <IconTable {...iconProps} />
      case 'excel-to-pdf': return <IconTable {...iconProps} />
      case 'pdf-to-powerpoint': return <IconLayout {...iconProps} />
      case 'powerpoint-to-pdf': return <IconLayout {...iconProps} />
      case 'pdf-to-images': return <IconPhoto {...iconProps} />
      case 'images-to-pdf': return <IconPhoto {...iconProps} />
      case 'pdf-to-text': return <IconFileText {...iconProps} />
      case 'text-to-pdf': return <IconFileText {...iconProps} />
      case 'pdf-to-html': return <IconCode {...iconProps} />
      case 'html-to-pdf': return <IconCode {...iconProps} />
      case 'pdf-to-markdown': return <IconCode {...iconProps} />
      case 'markdown-to-pdf': return <IconCode {...iconProps} />
      case 'word-to-excel': return <IconTable {...iconProps} />
      case 'word-to-powerpoint': return <IconLayout {...iconProps} />
      case 'excel-to-powerpoint': return <IconLayout {...iconProps} />
      case 'image-to-word': return <IconFileText {...iconProps} />
      case 'image-to-excel': return <IconTable {...iconProps} />
      case 'image-to-text': return <IconFileText {...iconProps} />
      case 'image-to-html': return <IconCode {...iconProps} />
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
  
  // AI
  
  
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

export default function ToolShowcase() {
  const { setView, setCurrentTrayId, setCurrentToolId } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const allTools = trays.flatMap(tray => 
    tray.tools.map(tool => ({
      ...tool,
      trayId: tray.id,
      trayName: tray.name,
      trayColor: tray.color
    }))
  )

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || tool.trayId === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleToolClick = (trayId: string, toolId: string) => {
    setCurrentTrayId(trayId)
    setCurrentToolId(toolId)
    setView('tool')
  }

  const categories = [
    { id: 'documents', name: 'Documents', count: allTools.filter(t => t.trayId === 'documents').length },
    { id: 'data', name: 'Data', count: allTools.filter(t => t.trayId === 'data').length },
    { id: 'media', name: 'Media', count: allTools.filter(t => t.trayId === 'media').length },
    { id: 'web', name: 'Web', count: allTools.filter(t => t.trayId === 'web').length },
    { id: 'ai', name: 'AI Assist', count: allTools.filter(t => t.trayId === 'ai').length },
    { id: 'security', name: 'Security', count: allTools.filter(t => t.trayId === 'security').length },
    { id: 'e-signature', name: 'E-Signature', count: allTools.filter(t => t.trayId === 'e-signature').length },
    { id: 'advanced', name: 'Advanced', count: allTools.filter(t => t.trayId === 'advanced').length }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center mb-16"
      >
        <motion.h2 variants={itemVariants} className="text-4xl font-heading font-semibold text-foreground mb-6">
          All Tools
        </motion.h2>
        <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover all {allTools.length} tools available in Trayyy. Each tool is designed to be simple, fast, and effective.
        </motion.p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mb-12"
      >
        <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full pl-12 pr-4 py-4 text-lg"
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({allTools.length})
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </motion.div>
      </motion.div>

      {/* Tools Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredTools.map((tool) => (
          <motion.div
            key={`${tool.trayId}-${tool.id}`}
            variants={itemVariants}
            onClick={() => handleToolClick(tool.trayId, tool.id)}
            className="card cursor-pointer hover:shadow-lg transition-all duration-200 group border-l-4"
            style={{ borderLeftColor: `var(--${tool.trayColor})` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-muted/50">
                  {getToolIcon(tool.id, tool.trayId)}
                </div>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-foreground">
                    {tool.name}
                  </h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[tool.trayId as keyof typeof categoryColors] || 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                    {tool.trayName}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
              {tool.description}
            </p>
            
            <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              <span>Use tool</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredTools.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground text-lg">
            No tools found matching your search criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory(null)
            }}
            className="btn-ghost mt-4"
          >
            Clear filters
          </button>
        </motion.div>
      )}
    </div>
  )
}
