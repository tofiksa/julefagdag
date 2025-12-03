import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { comment } = body

    // Validate required fields
    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment is required and cannot be empty' },
        { status: 400 }
      )
    }

    // Validate comment length (max 1000 characters)
    if (comment.length > 1000) {
      return NextResponse.json(
        { error: 'Comment cannot exceed 1000 characters' },
        { status: 400 }
      )
    }

    // Create event feedback
    const feedback = await prisma.eventFeedback.create({
      data: {
        comment: comment.trim(),
      },
    })

    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    console.error('Error creating event feedback:', error)
    return NextResponse.json(
      { error: 'Failed to create event feedback' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Verify admin authentication
  const { verifyAdminAuth } = await import('@/lib/admin-auth-server')
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin authentication required' },
      { status: 401 }
    )
  }

  try {
    // Get all event feedbacks ordered by creation date (newest first)
    const feedbacks = await prisma.eventFeedback.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(feedbacks, { status: 200 })
  } catch (error) {
    console.error('Error fetching event feedbacks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event feedbacks' },
      { status: 500 }
    )
  }
}

