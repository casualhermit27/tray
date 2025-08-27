import Stripe from 'stripe'
import { prisma } from './prisma'

export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    })
  : null

export const STRIPE_PLANS = {
  pro: {
    name: 'Pro Plan',
    price: 399, // $3.99 in cents
    features: [
      'Up to 100 MB files',
      'Process up to 20 files at once',
      'No watermark, no ads',
      'Priority processing',
      'All conversions available',
      'OCR support',
      'AI Assist features'
    ]
  },
  business: {
    name: 'Business Plan',
    price: 1999, // $19.99 in cents
    features: [
      'Unlimited file size',
      'Unlimited bulk processing',
      'Team accounts (3-5 members)',
      'API access for automation',
      'Priority support',
      'White-label output',
      'All Pro features included'
    ]
  }
}

const PRICE_IDS = {
  pro: process.env.STRIPE_PRO_PRICE_ID!,
}

export async function createCheckoutSession(userId: string, plan: 'pro') {
  if (!stripe) {
    return { success: false, error: 'Stripe not configured' }
  }
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: STRIPE_PLANS[plan].name,
              description: STRIPE_PLANS[plan].features.join(', '),
            },
            unit_amount: STRIPE_PLANS[plan].price,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId,
        plan,
      },
    })

    return { success: true, sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return { success: false, error: 'Failed to create checkout session' }
  }
}

export async function createCustomerPortalSession(customerId: string) {
  if (!stripe) {
    return { success: false, error: 'Stripe not configured' }
  }
  
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    return { success: true, url: session.url }
  } catch (error) {
    console.error('Customer portal error:', error)
    return { success: false, error: 'Failed to create customer portal session' }
  }
}

export async function handleWebhook(event: Stripe.Event) {
  if (!stripe) {
    return { success: false, error: 'Stripe not configured' }
  }
  
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break
      
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeletion(deletedSubscription)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Webhook handling error:', error)
    return { success: false, error: 'Webhook processing failed' }
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  const plan = subscription.metadata.plan
  
  if (!userId || !plan) return
  
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      status: subscription.status,
      plan,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
    },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      status: subscription.status,
      plan,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
    },
  })
}

async function handleSubscriptionDeletion(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  
  if (!userId) return
  
  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'canceled',
      plan: 'free',
    },
  })
}
