import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Subscription from '@/models/Subscription'

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
    
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const subscription = await Subscription.findOne({ userId: user._id })
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json({
      user: userWithoutPassword,
      subscription
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
    const { firstName, lastName, phone, company, jobTitle, website, bio, location, timezone, language } = body

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        firstName,
        lastName,
        phone,
        company,
        jobTitle,
        website,
        bio,
        location,
        timezone,
        language,
        updatedAt: new Date()
      },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser.toObject()

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
