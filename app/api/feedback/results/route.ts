import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAuth } from '@/lib/admin-auth-server'

export async function GET(request: NextRequest) {
  // Verify admin authentication
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin authentication required' },
      { status: 401 }
    )
  }

  try {
    // Get all sessions with their feedback
    const sessions = await prisma.session.findMany({
      include: {
        feedbacks: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    // Calculate statistics for each session
    const results = sessions.map((session) => {
      const totalFeedback = session.feedbacks.length
      const usefulCount = session.feedbacks.filter((f) => f.useful).length
      const learnedCount = session.feedbacks.filter((f) => f.learned).length
      const exploreCount = session.feedbacks.filter((f) => f.explore).length

      return {
        session: {
          id: session.id,
          title: session.title,
          speaker: session.speaker,
          room: session.room,
          startTime: session.startTime,
          endTime: session.endTime,
          description: session.description,
        },
        statistics: {
          totalFeedback,
          usefulCount,
          learnedCount,
          exploreCount,
          usefulPercentage: totalFeedback > 0 ? Math.round((usefulCount / totalFeedback) * 100) : 0,
          learnedPercentage: totalFeedback > 0 ? Math.round((learnedCount / totalFeedback) * 100) : 0,
          explorePercentage: totalFeedback > 0 ? Math.round((exploreCount / totalFeedback) * 100) : 0,
        },
        feedbacks: session.feedbacks.map((feedback) => ({
          id: feedback.id,
          useful: feedback.useful,
          learned: feedback.learned,
          explore: feedback.explore,
          createdAt: feedback.createdAt,
        })),
      }
    })

    return NextResponse.json(results, { status: 200 })
  } catch (error) {
    console.error('Error fetching feedback results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback results' },
      { status: 500 }
    )
  }
}

