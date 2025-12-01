import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, useful, learned, explore } = body

    // Validate required fields
    if (!sessionId || typeof useful !== 'boolean' || typeof learned !== 'boolean' || typeof explore !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing or invalid required fields: sessionId, useful, learned, explore' },
        { status: 400 }
      )
    }

    // Verify session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        sessionId,
        useful,
        learned,
        explore,
      },
    })

    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    console.error('Error creating feedback:', error)
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    )
  }
}

