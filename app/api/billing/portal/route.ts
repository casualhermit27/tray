import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createCustomerPortalSession } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's Stripe customer ID
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    })

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found' }, 
        { status: 404 }
      )
    }

    const result = await createCustomerPortalSession(subscription.stripeCustomerId)
    
    if (result.success) {
      return NextResponse.json({ url: result.url })
    } else {
      return NextResponse.json(
        { error: result.error }, 
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Billing portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create billing portal session' }, 
      { status: 500 }
    )
  }
}
