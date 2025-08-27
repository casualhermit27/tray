'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Download, FileText, FileSpreadsheet, FileImage, Globe, Code, Sparkles } from 'lucide-react'
import { useAppStore } from '@/store'

export default function OtherToPDFPage() {
  const { addJob } = useAppStore()
  const [file, setFile] = useState<File | null>(null)
  const [sourceFormat, setSourceFormat] = useState('docx')
  const [pageSize, setPageSize] = useState('a4')
  const [orientation, setOrientation] = useState('portrait')
  const [isProcessing, setIsProcessing] = useState(false)

  const formatOptions = [
    { value: 'docx', label: 'Word Document', icon: <FileText className="w-5 h-5" />, color: 'from-blue-500 to-blue-600', accept: '.docx,.doc' },
    { value: 'xlsx', label: 'Excel Spreadsheet', icon: <FileSpreadsheet className="w-5 h-5" />, color: 'from-green-500 to-green-600', accept: '.xlsx,.xls' },
    { value: 'txt', label: 'Plain Text', icon: <FileText className="w-5 h-5" />, color: 'from-gray-500 to-gray-600', accept: '.txt' },
    { value: 'html', label: 'HTML Web Page', icon: <Globe className="w-5 h-5" />, color: 'from-orange-500 to-orange-600', accept: '.html,.htm' },
    { value: 'markdown', label: 'Markdown', icon: <Code className="w-5 h-5" />, color: 'from-purple-500 to-purple-600', accept: '.md' },
    { value: 'images', label: 'Images', icon: <FileImage className="w-5 h-5" />, color: 'from-pink-500 to-pink-600', accept: '.png,.jpg,.jpeg,.webp' }
  ]

  const pageSizeOptions = [
    { value: 'a4', label: 'A4 (210 × 297 mm)', color: 'from-slate-500 to-slate-600' },
    { value: 'letter', label: 'Letter (8.5 × 11 in)', color: 'from-blue-500 to-blue-600' },
    { value: 'legal', label: 'Legal (8.5 × 14 in)', color: 'from-green-500 to-green-600' },
    { value: 'a3', label: 'A3 (297 × 420 mm)', color: 'from-purple-500 to-purple-600' }
  ]

  const orientationOptions = [
    { value: 'portrait', label: 'Portrait', icon: '📄', color: 'from-blue-500 to-blue-600' },
    { value: 'landscape', label: 'Landscape', icon: '📄', color: 'from-green-500 to-green-600' }
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleConvert = async () => {
    if (!file) return

    setIsProcessing(true)
    
    // Simulate processing
    setTimeout(() => {
      const jobId = `${sourceFormat}-to-pdf-${Date.now()}`
      addJob({
        id: jobId,
        toolId: 'other-to-pdf',
        status: 'completed',
        progress: 100,
        file: file,
        result: { text: `Converted ${file.name} to PDF` },
        createdAt: new Date()
      })
      setIsProcessing(false)
    }, 2000)
  }

  const currentFormat = formatOptions.find(opt => opt.value === sourceFormat)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Professional PDF Creation</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight">
            Other Formats to PDF
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Transform your documents into professional PDFs with customizable settings
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-16"
        >
          {/* Left Column - File Upload */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-xl shadow-emerald-500/5 border border-white/20">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                <h3 className="text-2xl lg:text-3xl font-semibold text-slate-800">Upload File</h3>
              </div>
              
              <div className="group relative">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 lg:p-16 text-center transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-50/30">
                  <div className="relative">
                    <Upload className="w-20 h-20 lg:w-24 lg:h-24 text-slate-400 mx-auto mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:text-emerald-500" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{currentFormat?.label.split(' ')[0]?.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <p className="text-lg lg:text-xl text-slate-600 mb-8 leading-relaxed">
                    Drag and drop your {currentFormat?.label.split(' ')[0]} file here, or click to browse
                  </p>
                  
                  <input
                    type="file"
                    accept={currentFormat?.accept}
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-medium text-lg cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105"
                  >
                    <span>Choose {currentFormat?.label.split(' ')[0]} File</span>
                    <Upload className="w-5 h-5" />
                  </label>
                </div>
              </div>

              {file && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-lg font-medium text-green-800">
                        {file.name}
                      </p>
                      <p className="text-sm text-green-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to convert
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Options & Convert */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-xl shadow-emerald-500/5 border border-white/20">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-2 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></div>
                <h3 className="text-2xl lg:text-3xl font-semibold text-slate-800">Conversion Options</h3>
              </div>
              
              <div className="space-y-8">
                {/* Source Format */}
                <div>
                  <label className="block text-lg font-medium text-slate-700 mb-4">
                    Source Format
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {formatOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSourceFormat(option.value)}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                          sourceFormat === option.value
                            ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${option.color} text-white`}>
                            {option.icon}
                          </div>
                          <span className={`font-medium ${
                            sourceFormat === option.value ? 'text-emerald-700' : 'text-slate-700'
                          }`}>
                            {option.label}
                          </span>
                        </div>
                        {sourceFormat === option.value && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Page Size */}
                <div>
                  <label className="block text-lg font-medium text-slate-700 mb-4">
                    Page Size
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {pageSizeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPageSize(option.value)}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                          pageSize === option.value
                            ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-center">
                          <span className={`font-medium ${
                            pageSize === option.value ? 'text-emerald-700' : 'text-slate-700'
                          }`}>
                            {option.label}
                          </span>
                        </div>
                        {pageSize === option.value && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orientation */}
                <div>
                  <label className="block text-lg font-medium text-slate-700 mb-4">
                    Orientation
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {orientationOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setOrientation(option.value)}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                          orientation === option.value
                            ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{option.icon}</div>
                          <span className={`font-medium ${
                            orientation === option.value ? 'text-emerald-700' : 'text-slate-700'
                          }`}>
                            {option.label}
                          </span>
                        </div>
                        {orientation === option.value && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Convert Button */}
              <button
                onClick={handleConvert}
                disabled={!file || isProcessing}
                className="w-full mt-10 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-5 rounded-2xl font-semibold text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Converting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <span>Convert to PDF</span>
                    <Download className="w-6 h-6" />
                  </div>
                )}
              </button>
            </div>

            {/* Format Info */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-xl shadow-emerald-500/5 border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                <h3 className="text-2xl lg:text-3xl font-semibold text-slate-800">About {currentFormat?.label.split(' ')[0]}</h3>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${currentFormat?.color} text-white`}>
                  {currentFormat?.icon}
                </div>
                <span className="text-xl font-medium text-slate-700">
                  {currentFormat?.label}
                </span>
              </div>
              
              <p className="text-lg text-slate-600 leading-relaxed">
                {sourceFormat === 'docx' && 'Convert Word documents while preserving formatting and layout for professional output'}
                {sourceFormat === 'xlsx' && 'Transform Excel spreadsheets into print-ready PDF reports with data integrity'}
                {sourceFormat === 'txt' && 'Convert plain text files to formatted PDF documents with clean typography'}
                {sourceFormat === 'html' && 'Transform web pages into professional PDF documents with web styling'}
                {sourceFormat === 'markdown' && 'Convert Markdown files to beautifully formatted PDFs with structure'}
                {sourceFormat === 'images' && 'Combine multiple images into a single PDF document with high quality'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
