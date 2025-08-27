import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Subscription from '@/models/Subscription'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { email, password, firstName, lastName, phone, company, jobTitle, website, bio, location, timezone, language } = body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      company,
      jobTitle,
      website,
      bio,
      location,
      timezone,
      language: language || 'en'
    })

    // Create free subscription
    await Subscription.create({
      userId: user._id,
      plan: 'free',
      status: 'active',
      planName: 'Free Plan',
      planDescription: 'Basic access to all tools',
      maxFileSize: 10,
      maxFilesPerMonth: 100,
      maxTeamMembers: 1,
      maxApiCalls: 1000
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json({
      message: 'User created successfully',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
