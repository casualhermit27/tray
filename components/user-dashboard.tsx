'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Building, 
  MapPin, 
  Clock, 
  Globe, 
  Phone, 
  Crown, 
  Calendar,
  FileText,
  BarChart3,
  CreditCard,
  Settings,
  Edit,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { useSession } from 'next-auth/react'

interface UserProfile {
  id: string
  name: string | null
  email: string | null
  image: string | null
  firstName: string | null
  lastName: string | null
  phone: string | null
  company: string | null
  jobTitle: string | null
  website: string | null
  bio: string | null
  location: string | null
  timezone: string | null
  language: string | null
  isActive: boolean
  lastLoginAt: string | null
  loginCount: number
  createdAt: string
  updatedAt: string
}

interface Subscription {
  id: string
  status: string
  plan: string
  planName: string | null
  planDescription: string | null
  amount: number | null
  currency: string
  billingCycle: string | null
  trialEnd: string | null
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  canceledAt: string | null
  maxFileSize: number | null
  maxFilesPerMonth: number | null
  maxTeamMembers: number | null
  maxApiCalls: number | null
  createdAt: string
  updatedAt: string
}

interface UsageStats {
  id: string
  toolId: string
  toolName: string
  trayId: string
  action: string
  fileSize: number | null
  fileCount: number | null
  processingTime: number | null
  date: string
  timestamp: string
}

interface PaymentHistory {
  id: string
  amount: number
  currency: string
  status: string
  description: string | null
  plan: string | null
  billingCycle: string | null
  paidAt: string | null
  createdAt: string
}

interface UserData {
  user: UserProfile
  subscription: Subscription | null
  usageStats: UsageStats[]
  paymentHistory: PaymentHistory[]
}

export default function UserDashboard() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData()
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/profile')
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      
      const data = await response.json()
      setUserData(data.user)
    } catch (err) {
      setError('Failed to load user data')
      console.error('Error fetching user data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '0 B'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100) // Convert from cents
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'inactive':
        return 'text-red-600 bg-red-100'
      case 'trialing':
        return 'text-blue-600 bg-blue-100'
      case 'past_due':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-foreground"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchUserData}
          className="mt-4 btn-ghost"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="text-center py-8">
        <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No user data available</p>
      </div>
    )
  }

  const { user, subscription, usageStats, paymentHistory } = userData

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Dashboard</h1>
          <p className="text-muted-foreground">Manage your account and view usage statistics</p>
        </div>
        <button className="btn-ghost">
          <Settings className="h-5 w-5 mr-2" />
          Settings
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'subscription', label: 'Subscription', icon: Crown },
            { id: 'usage', label: 'Usage', icon: BarChart3 },
            { id: 'payments', label: 'Payments', icon: CreditCard }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{user.name || 'Not provided'}</p>
                    </div>
                  </div>

                  {user.firstName && (
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">First Name</p>
                        <p className="font-medium">{user.firstName}</p>
                      </div>
                    </div>
                  )}

                  {user.lastName && (
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Last Name</p>
                        <p className="font-medium">{user.lastName}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Login Count</p>
                      <p className="font-medium">{user.loginCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Professional Information
                </h3>
                <div className="space-y-4">
                  {user.company && (
                    <div className="flex items-center space-x-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        <p className="font-medium">{user.company}</p>
                      </div>
                    </div>
                  )}

                  {user.jobTitle && (
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Job Title</p>
                        <p className="font-medium">{user.jobTitle}</p>
                      </div>
                    </div>
                  )}

                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {user.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a 
                          href={user.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {user.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {user.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{user.location}</p>
                      </div>
                    </div>
                  )}

                  {user.timezone && (
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Timezone</p>
                        <p className="font-medium">{user.timezone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {user.bio && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Bio</h3>
                <p className="text-muted-foreground">{user.bio}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {subscription ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Plan */}
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Crown className="h-5 w-5 mr-2" />
                    Current Plan
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Plan</span>
                      <span className="font-semibold">{subscription.planName || subscription.plan}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                        {subscription.status}
                      </span>
                    </div>

                    {subscription.amount && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <span className="font-semibold">
                          {formatCurrency(subscription.amount, subscription.currency)}
                          {subscription.billingCycle && `/${subscription.billingCycle}`}
                        </span>
                      </div>
                    )}

                    {subscription.currentPeriodStart && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current Period</span>
                        <span className="font-medium">
                          {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                        </span>
                      </div>
                    )}

                    {subscription.trialEnd && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Trial Ends</span>
                        <span className="font-medium">{formatDate(subscription.trialEnd)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Plan Limits */}
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Plan Limits</h3>
                  <div className="space-y-4">
                    {subscription.maxFileSize && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Max File Size</span>
                        <span className="font-medium">{formatFileSize(subscription.maxFileSize)}</span>
                      </div>
                    )}

                    {subscription.maxFilesPerMonth && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Files per Month</span>
                        <span className="font-medium">{subscription.maxFilesPerMonth}</span>
                      </div>
                    )}

                    {subscription.maxTeamMembers && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Team Members</span>
                        <span className="font-medium">{subscription.maxTeamMembers}</span>
                      </div>
                    )}

                    {subscription.maxApiCalls && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">API Calls</span>
                        <span className="font-medium">{subscription.maxApiCalls}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card text-center py-8">
                <Crown className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
                <p className="text-muted-foreground mb-4">You're currently on the free plan</p>
                <button className="btn-ghost bg-foreground text-background hover:bg-foreground/90">
                  Upgrade Plan
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Recent Usage
              </h3>
              
              {usageStats.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-4">Tool</th>
                        <th className="text-left py-2 px-4">Action</th>
                        <th className="text-left py-2 px-4">File Size</th>
                        <th className="text-left py-2 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usageStats.slice(0, 10).map((stat) => (
                        <tr key={stat.id} className="border-b border-border">
                          <td className="py-2 px-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{stat.toolName}</span>
                              <span className="text-xs text-muted-foreground">({stat.trayId})</span>
                            </div>
                          </td>
                          <td className="py-2 px-4 capitalize">{stat.action}</td>
                          <td className="py-2 px-4">{formatFileSize(stat.fileSize)}</td>
                          <td className="py-2 px-4">{formatDate(stat.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No usage data available</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment History
              </h3>
              
              {paymentHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-4">Date</th>
                        <th className="text-left py-2 px-4">Amount</th>
                        <th className="text-left py-2 px-4">Plan</th>
                        <th className="text-left py-2 px-4">Status</th>
                        <th className="text-left py-2 px-4">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id} className="border-b border-border">
                          <td className="py-2 px-4">{formatDate(payment.createdAt)}</td>
                          <td className="py-2 px-4 font-medium">
                            {formatCurrency(payment.amount, payment.currency)}
                          </td>
                          <td className="py-2 px-4">{payment.plan || 'N/A'}</td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-2 px-4 text-sm text-muted-foreground">
                            {payment.description || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No payment history available</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
