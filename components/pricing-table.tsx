'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Crown, Star, Zap } from 'lucide-react'
import { TOOL_LIMITS } from '@/lib/pricing/feature-limits'

export function PricingTable() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'All Tools', icon: Star },
    { id: 'pdf', name: 'PDF Tools', icon: Crown },
    { id: 'data', name: 'Data Tools', icon: Zap },
    { id: 'media', name: 'Media Tools', icon: Zap },
    { id: 'web', name: 'Web Tools', icon: Zap },
    { id: 'ai', name: 'AI Tools', icon: Zap },
    { id: 'security', name: 'Security', icon: Zap },
    { id: 'esignature', name: 'E-Signature', icon: Zap },
    { id: 'advanced', name: 'Advanced', icon: Zap }
  ]

  const getCategoryTools = (categoryId: string) => {
    if (categoryId === 'all') return Object.values(TOOL_LIMITS)
    
    const categoryMap: Record<string, string[]> = {
      pdf: ['pdf-merge', 'pdf-compress', 'pdf-extract', 'pdf-to-office'],
      data: ['excel-to-csv', 'csv-to-excel', 'json-formatter', 'excel-cleaner'],
      media: ['image-compression', 'format-conversion', 'ocr-extraction', 'background-removal'],
      web: ['html-to-markdown', 'text-extraction', 'screenshot-tool'],
  
      security: ['pdf-password-remove', 'pdf-password-protect', 'pdf-encrypt'],
      esignature: ['digital-signature', 'form-filling', 'signature-verification'],
      advanced: ['folder-processing', 'workflow-automation', 'batch-conversion']
    }
    
    const toolIds = categoryMap[categoryId] || []
    return Object.values(TOOL_LIMITS).filter(tool => toolIds.includes(tool.toolId))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return 'Not Available'
    const mb = bytes / (1024 * 1024)
    return `${mb}MB`
  }

  const formatLimit = (limit: number): string => {
    if (limit === -1) return 'Unlimited'
    return limit.toString()
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Detailed Feature Comparison
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Pricing Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[200px]">
                  Tool & Features
                </th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900">
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span>Free Plan</span>
                  </div>
                </th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <Crown className="h-5 w-5" />
                    <span>Pro Plan</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {getCategoryTools(selectedCategory).map((tool, index) => (
                <motion.tr
                  key={tool.toolId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-900">{tool.toolName}</div>
                    <div className="text-sm text-gray-500 mt-1">Tool ID: {tool.toolId}</div>
                  </td>
                  
                  {/* Free Plan */}
                  <td className="py-4 px-6 text-center">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">File Size:</span> {formatFileSize(tool.free.maxFileSize)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Files:</span> {formatLimit(tool.free.maxFilesPerTask)}
                      </div>
                      {tool.free.maxPagesPerTask && (
                        <div className="text-sm">
                          <span className="font-medium">Pages:</span> {formatLimit(tool.free.maxPagesPerTask)}
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="font-medium">Hourly:</span> {formatLimit(tool.free.maxTasksPerHour)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Batch:</span> {tool.free.batchProcessing ? 'Yes' : 'No'}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Advanced:</span> {tool.free.advancedFeatures ? 'Yes' : 'No'}
                      </div>
                      {tool.free.watermark && (
                        <div className="text-sm text-red-600 font-medium">Watermarked</div>
                      )}
                    </div>
                  </td>
                  
                  {/* Pro Plan */}
                  <td className="py-4 px-6 text-center bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">File Size:</span> {formatFileSize(tool.pro.maxFileSize)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Files:</span> {formatLimit(tool.pro.maxFilesPerTask)}
                      </div>
                      {tool.pro.maxPagesPerTask && (
                        <div className="text-sm">
                          <span className="font-medium">Pages:</span> {formatLimit(tool.pro.maxPagesPerTask)}
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="font-medium">Hourly:</span> {formatLimit(tool.pro.maxTasksPerHour)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Batch:</span> {tool.pro.batchProcessing ? 'Yes' : 'No'}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Advanced:</span> {tool.pro.advancedFeatures ? 'Yes' : 'No'}
                      </div>
                      {!tool.pro.watermark && (
                        <div className="text-sm text-green-600 font-medium">No Watermark</div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center p-6 bg-yellow-50 rounded-xl border border-yellow-200">
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">Free Plan</h3>
            <div className="text-3xl font-bold text-yellow-600 mb-2">₹0</div>
            <p className="text-yellow-700">Perfect for occasional use</p>
            <ul className="text-sm text-yellow-700 mt-3 space-y-1">
              <li>• 3 tasks per hour</li>
              <li>• 10MB file limit</li>
              <li>• Single file processing</li>
              <li>• Basic features only</li>
            </ul>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Pro Plan</h3>
            <div className="text-3xl font-bold mb-2">₹399/month</div>
            <p className="opacity-90">For power users & professionals</p>
            <ul className="opacity-90 mt-3 space-y-1 text-sm">
              <li>• Unlimited tasks</li>
              <li>• 100MB file limit</li>
              <li>• Batch processing</li>
              <li>• All features unlocked</li>
            </ul>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
            <h3 className="text-xl font-semibold text-green-800 mb-2">Annual Savings</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">₹3,999</div>
            <p className="text-green-700">Save ₹789 per year</p>
            <div className="text-sm text-green-700 mt-3">
              <div>Monthly: ₹399 × 12 = ₹4,788</div>
              <div>Annual: ₹3,999</div>
              <div className="font-semibold mt-1">You save: ₹789</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to unlock unlimited processing?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Start with our free plan to experience the value, then upgrade to Pro when you need more power.
            No long-term contracts, cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
              Start Free Trial
            </button>
            <button className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-300 hover:text-blue-600 transition-all">
              View All Features
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
