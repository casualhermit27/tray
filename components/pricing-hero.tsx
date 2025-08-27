'use client'

import { motion } from 'framer-motion'
import { Crown, Zap, Shield, CheckCircle } from 'lucide-react'

export function PricingHero() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Lean Pricing Strategy
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            No fluff, just value. Start free, upgrade when you hit limits.
          </p>
        </motion.div>

        {/* Core Value Props */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Frictionless Free</h3>
            <p className="text-gray-600">Access all core tools with smart limits that drive adoption</p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Pain Point Removal</h3>
            <p className="text-gray-600">Pro plan eliminates frustration with unlimited processing</p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <Crown className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Upselling</h3>
            <p className="text-gray-600">Upgrade prompts appear exactly when users need more</p>
          </div>
        </motion.div>

        {/* Free Plan Hook */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8 mb-12 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Free Plan Strategy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                What's Included
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• All core PDF tools (compress, merge, split, convert)</li>
                <li>• 3 operations per hour (IP-based rate limiting)</li>
                <li>• 10 MB file size cap</li>
                <li>• Instant processing (no storage)</li>
                <li>• Single file uploads</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Crown className="h-5 w-5 text-purple-600 mr-2" />
                Upgrade Triggers
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Hit operation limit</li>
                <li>• Upload file &gt; 10 MB</li>
                <li>• Try batch upload</li>
                <li>• Experience queue delay</li>
                <li>• Need advanced features</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Pro Plan Value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-8 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">💎 Pro Plan Value</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Unlimited Power</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Unlimited operations (no hourly caps)</li>
                <li>• 100 MB file size limit</li>
                <li>• Batch processing (up to 10 files)</li>
                <li>• Priority queue (faster processing)</li>
                <li>• All tools unlocked</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Premium Features</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Early access to new tools</li>
                <li>• Email support</li>
                <li>• No watermarks</li>
                <li>• Advanced processing modes</li>
                <li>• Professional workflows</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Pricing Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto"
        >
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
            <div className="text-4xl font-bold text-gray-900 mb-2">₹0</div>
            <p className="text-gray-600">Forever</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-2">₹399</div>
            <p className="opacity-90">per month</p>
            <div className="text-sm opacity-75 mt-1">or ₹3,999/year</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
