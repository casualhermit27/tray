import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { UsageTracker } from '@/lib/usage-tracker'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await UsageTracker.getUserStats(session.user.id)
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('User stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user stats' }, 
      { status: 500 }
    )
  }
}
