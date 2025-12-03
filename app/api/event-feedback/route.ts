import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { comment, rating } = body

    // At least one of comment or rating must be provided
    const hasComment = comment && typeof comment === 'string' && comment.trim().length > 0
    const hasRating = rating !== null && rating !== undefined

    if (!hasComment && !hasRating) {
      return NextResponse.json(
        { error: 'Either a comment or a rating must be provided' },
        { status: 400 }
      )
    }

    // Validate comment length if provided (max 1000 characters)
    if (hasComment && comment.length > 1000) {
      return NextResponse.json(
        { error: 'Comment cannot exceed 1000 characters' },
        { status: 400 }
      )
    }

    // Validate rating if provided (must be between 1 and 5)
    if (hasRating) {
      const ratingNum = Number(rating)
      if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return NextResponse.json(
          { error: 'Rating must be an integer between 1 and 5' },
          { status: 400 }
        )
      }
    }

    // Create event feedback
    const feedback = await prisma.eventFeedback.create({
      data: {
        comment: hasComment ? comment.trim() : '',
        rating: hasRating ? Number(rating) : null,
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

