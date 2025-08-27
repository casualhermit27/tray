import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import UsageStats from '@/models/UsageStats'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    await connectDB()
    
    // Get current month
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    
    // Get usage stats for current month
    const usageStats = await UsageStats.find({
      userId: session.user.id,
      month: currentMonth
    })

    // Calculate totals
    const totals = {
      totalFiles: usageStats.reduce((sum, stat) => sum + stat.fileCount, 0),
      totalSize: usageStats.reduce((sum, stat) => sum + stat.totalFileSize, 0),
      totalProcessingTime: usageStats.reduce((sum, stat) => sum + stat.processingTime, 0),
      totalSuccess: usageStats.reduce((sum, stat) => sum + stat.successCount, 0),
      totalErrors: usageStats.reduce((sum, stat) => sum + stat.errorCount, 0)
    }

    return NextResponse.json({
      currentMonth,
      usageStats,
      totals
    })

  } catch (error) {
    console.error('Usage fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    await connectDB()
    
    const body = await request.json()
    const { toolId, toolName, fileCount, totalFileSize, processingTime, success, error } = body

    // Get current month
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    // Find existing usage stat or create new one
    let usageStat = await UsageStats.findOne({
      userId: session.user.id,
      toolId,
      month: currentMonth
    })

    if (usageStat) {
      // Update existing stat
      usageStat.fileCount += fileCount || 0
      usageStat.totalFileSize += totalFileSize || 0
      usageStat.processingTime += processingTime || 0
      if (success) usageStat.successCount += 1
      if (error) usageStat.errorCount += 1
      usageStat.lastUsed = new Date()
      await usageStat.save()
    } else {
      // Create new stat
      await UsageStats.create({
        userId: session.user.id,
        toolId,
        toolName,
        fileCount: fileCount || 0,
        totalFileSize: totalFileSize || 0,
        processingTime: processingTime || 0,
        successCount: success ? 1 : 0,
        errorCount: error ? 1 : 0,
        month: currentMonth
      })
    }

    return NextResponse.json({
      message: 'Usage tracked successfully'
    })

  } catch (error) {
    console.error('Usage tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
