'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { User, LogOut, Crown, Settings, ChevronDown } from 'lucide-react'
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
  IconSettings as IconTablerSettings,
  IconPuzzle,
  IconTransform
} from '@tabler/icons-react'
import { useAppStore, usePlanStore } from '@/store'
import { trays } from '@/data/trays'
import { getSEODataByToolId } from '@/data/seo-data'
import { UsageIndicator } from './usage-indicator'

export default function Navigation() {
  const { data: session } = useSession()
  const { setView, setCurrentTrayId, setCurrentToolId } = useAppStore()
  const { currentPlan, planDetails } = usePlanStore()
  const [showToolsDropdown, setShowToolsDropdown] = useState(false)
  const toolsDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setShowToolsDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleToolSelect = (trayId: string, toolId: string) => {
    setCurrentTrayId(trayId)
    setCurrentToolId(toolId)
    setView('tool')
    setShowToolsDropdown(false)
  }

  const getToolLink = (toolId: string) => {
    const seoData = getSEODataByToolId(toolId)
    return seoData ? `/${seoData.slug}` : '/tool'
  }

  const getTrayIcon = (trayId: string) => {
    const iconProps = { size: 18, className: "text-muted-foreground" }
    
    switch (trayId) {
      case 'documents': return <IconFileText {...iconProps} />
      case 'data': return <IconTable {...iconProps} />
      case 'media': return <IconPhoto {...iconProps} />
      case 'web': return <IconWorld {...iconProps} />
  
      case 'security': return <IconLock {...iconProps} />
      case 'e-signature': return <IconSignature {...iconProps} />
      case 'advanced': return <IconTablerSettings {...iconProps} />
      default: return <IconFileText {...iconProps} />
    }
  }

  const getToolIcon = (toolId: string, trayId: string) => {
    const iconProps = { size: 14, className: "text-muted-foreground" }
    
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
        default: return <IconTablerSettings {...iconProps} />
      }
    }
    
    return <IconFileText {...iconProps} />
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro':
        return <Crown className="h-5 w-5 text-yellow-500" />
      default:
        return <Crown className="h-5 w-5 text-gray-500" />
    }
  }

  const canAccessTool = (tool: any) => {
    if (!tool.planRequired || tool.planRequired === 'free') return true
    if (tool.planRequired === 'pro' && currentPlan === 'pro') return true
    return false
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/"
            onClick={() => setView('landing')}
            className="flex items-center space-x-2 group"
          >
            <Image
              src="/trayyy logo.png"
              alt="Trayyy Logo"
              width={56}
              height={56}
              className="w-14 h-14 rounded-lg"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/pricing"
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              Pricing
            </Link>
            
            {/* Tools Dropdown */}
            <div className="relative" ref={toolsDropdownRef}>
              <button
                onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                className="text-foreground hover:text-muted-foreground transition-colors flex items-center space-x-2"
              >
                <span>Tools</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showToolsDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showToolsDropdown && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-lg shadow-lg z-50 mt-8">
                  <div className="p-6">
                    <div className="flex space-x-10">
                      {trays.map((tray) => (
                        <div key={tray.id} className="min-w-44">
                          <h3 className="font-medium text-foreground mb-4 flex items-center space-x-2 text-sm border-b border-border pb-2">
                            {getTrayIcon(tray.id)}
                            <span>{tray.name}</span>
                          </h3>
                          <div className="space-y-2">
                            {tray.tools.map((tool) => {
                              const canAccess = canAccessTool(tool)
                              
                              return canAccess ? (
                                <Link
                                  key={tool.id}
                                  href={getToolLink(tool.id)}
                                  onClick={() => handleToolSelect(tray.id, tool.id)}
                                  className="w-full text-left px-3 py-2 rounded text-xs transition-colors block text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      {getToolIcon(tool.id, tray.id)}
                                      <span>{tool.name}</span>
                                    </div>
                                  </div>
                                </Link>
                              ) : (
                                <div
                                  key={tool.id}
                                  className="w-full text-left px-3 py-2 rounded text-xs transition-colors block text-muted-foreground/50 cursor-not-allowed"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      {getToolIcon(tool.id, tray.id)}
                                      <span>{tool.name}</span>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground">
                                      {tool.planRequired === 'pro' ? 'PRO' : 'FREE'}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {session && (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/account"
                  onClick={() => setView('account')}
                  className="text-foreground hover:text-muted-foreground transition-colors"
                >
                  Account
                </Link>
                <Link 
                  href="/dashboard"
                  onClick={() => setView('dashboard')}
                  className="text-foreground hover:text-muted-foreground transition-colors"
                >
                  Plans
                </Link>
              </div>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                {/* Usage Indicator */}
                <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                  {getPlanIcon(currentPlan)}
                  <span>{planDetails.name}</span>
                </div>
                
                {/* Daily Usage Indicator */}
                <UsageIndicator />
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium">
                      {session.user?.name || session.user?.email}
                    </span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        href="/account"
                        onClick={() => setView('account')}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Account Settings</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setView('dashboard')}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Crown className="h-4 w-4" />
                        <span>Plans & Usage</span>
                      </Link>
                      <Link
                        href="/help"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <IconTablerSettings className="h-4 w-4" />
                        <span>Help & Support</span>
                      </Link>
                      <div className="border-t border-border my-1"></div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="btn-ghost"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn-ghost bg-foreground text-background hover:bg-foreground/90"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
