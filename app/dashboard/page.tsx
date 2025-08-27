'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut, 
  Crown,
  Zap,
  Users,
  FileText,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useAppStore, usePlanStore } from '@/store'
import { trays } from '@/data/trays'
import { PLANS } from '@/lib/plans'

interface UserStats {
  plan: string
  todayUsage: number
  monthlyUsage: number
  limit: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { setView, setCurrentTrayId, setCurrentToolId } = useAppStore()
  const { currentPlan, planDetails, planLimits } = usePlanStore()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Remove authentication requirement - dashboard is now public
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const stats = await response.json()
        setUserStats(stats)
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = () => {
    router.push('/pricing')
  }

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST'
      })
      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      }
    } catch (error) {
      console.error('Failed to create billing portal session:', error)
    }
  }

  const handleToolClick = (trayId: string, toolId: string) => {
    setCurrentTrayId(trayId)
    setCurrentToolId(toolId)
    setView('tool')
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro':
        return <Zap className="h-5 w-5 text-yellow-500" />
      default:
        return <Crown className="h-5 w-5 text-gray-500" />
    }
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'Pro Plan'
      default:
        return 'Free Plan'
    }
  }

  const getDailyLimit = () => {
    if (planLimits.maxDailyTasks === -1) return '∞'
    return planLimits.maxDailyTasks.toString()
  }

  const getFileSizeLimit = () => {
    if (planLimits.maxFileSize === -1) return 'Unlimited'
    const mb = Math.round(planLimits.maxFileSize / (1024 * 1024))
    return `${mb} MB`
  }

  const getMaxFilesAtOnce = () => {
    if (planLimits.maxFilesAtOnce === -1) return 'Unlimited'
    return planLimits.maxFilesAtOnce.toString()
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show guest view if not signed in
  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-muted/50">
                  <User className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-heading font-semibold text-foreground">
                    Welcome to Trayyy Dashboard
                  </h1>
                  <p className="text-muted-foreground">
                    Sign in to access your personalized dashboard
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="btn-ghost"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="btn-ghost bg-foreground text-background hover:bg-foreground/90"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Explore Our Tools
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Access powerful file processing tools without signing up
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => setView('landing')}
                className="card p-6 text-center hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <FileText className="h-12 w-12 text-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">All Tools</h3>
                <p className="text-muted-foreground">Browse and use all available tools</p>
              </button>

              <button
                onClick={() => setView('tool-showcase')}
                className="card p-6 text-center hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <BarChart3 className="h-12 w-12 text-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Tool Showcase</h3>
                <p className="text-muted-foreground">View all tools organized by category</p>
              </button>

              <button
                onClick={() => router.push('/pricing')}
                className="card p-6 text-center hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <Crown className="h-12 w-12 text-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Pricing</h3>
                <p className="text-muted-foreground">See our plans and upgrade options</p>
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-muted/50">
                <User className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-semibold text-foreground">
                  Welcome back, {session.user?.name || 'User'}
                </h1>
                <p className="text-muted-foreground">
                  Manage your account and tools
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleManageBilling}
                className="btn-ghost flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Billing</span>
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn-ghost flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                  <User className="h-8 w-8 text-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {session.user?.name || 'User'}
                  </h3>
                  <p className="text-muted-foreground">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="text-foreground">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
            </motion.div>

            {/* Subscription Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center space-x-3 mb-4">
                {getPlanIcon(currentPlan)}
                <h3 className="text-lg font-semibold text-foreground">
                  {planDetails.name}
                </h3>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Daily limit</span>
                  <span className="text-foreground font-medium">
                    {getDailyLimit()} conversions
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">File size limit</span>
                  <span className="text-foreground font-medium">
                    {getFileSizeLimit()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Max files at once</span>
                  <span className="text-foreground font-medium">
                    {getMaxFilesAtOnce()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Today used</span>
                  <span className="text-foreground font-medium">
                    {userStats?.todayUsage || 0} / {getDailyLimit()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Monthly total</span>
                  <span className="text-foreground font-medium">
                    {userStats?.monthlyUsage || 0}
                  </span>
                </div>
              </div>

              {currentPlan === 'free' && (
                <button
                  onClick={handleUpgrade}
                  className="w-full btn-ghost bg-foreground text-background hover:bg-foreground/90"
                >
                  Upgrade to Pro
                </button>
              )}
            </motion.div>

            {/* Usage Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Daily Usage
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground font-medium">
                    {planLimits.maxDailyTasks === -1 ? '∞' : 
                      Math.round(((userStats?.todayUsage || 0) / planLimits.maxDailyTasks) * 100)}%
                  </span>
                </div>
                
                {planLimits.maxDailyTasks !== -1 && (
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-foreground h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(((userStats?.todayUsage || 0) / planLimits.maxDailyTasks) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  {planLimits.maxDailyTasks === -1 ? 'Unlimited daily usage' : 'Resets daily at midnight UTC'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Quick Actions & Tools */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setView('landing')}
                  className="card p-6 text-left hover:shadow-lg transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
                      <FileText className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">All Tools</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Browse and use all available file processing tools
                  </p>
                </button>

                <button
                  onClick={() => router.push('/pricing')}
                  className="card p-6 text-left hover:shadow-lg transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
                      <TrendingUp className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">Upgrade Plan</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get unlimited conversions and advanced features
                  </p>
                </button>
              </div>
            </motion.div>

            {/* Recent Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
                Popular Tools
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trays.slice(0, 6).map((tray) => (
                  <div
                    key={tray.id}
                    className="card p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    onClick={() => setView('dashboard')}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
                        <FileText className="h-4 w-4 text-foreground" />
                      </div>
                      <h3 className="font-medium text-foreground text-sm">
                        {tray.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tray.tools.length} tools available
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Activity Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Activity Summary
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {userStats?.monthlyUsage || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Files processed this month
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {userStats?.todayUsage || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Files processed today
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {getDailyLimit()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Daily limit
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
