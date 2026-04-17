import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'

// GET /api/flashcards — list decks
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const decks = await prisma.flashcardDeck.findMany({
    where: { userId: session.user.id },
    include: {
      cards: {
        select: {
          id: true, front: true, back: true, hint: true, topic: true,
          difficulty: true, nextReview: true, reviewCount: true, lastResult: true,
          citationText: true, citationSrc: true, citationPage: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  // Compute deck stats
  const decksWithStats = decks.map(deck => {
    const now = new Date()
    const mastered = deck.cards.filter(c => c.lastResult === 'easy' && c.reviewCount >= 3).length
    const learning = deck.cards.filter(c => c.lastResult === 'good' || c.lastResult === 'hard').length
    const newCards = deck.cards.filter(c => c.reviewCount === 0).length
    const dueNow = deck.cards.filter(c => c.nextReview <= now).length

    return {
      ...deck,
      studyStats: {
        totalCards: deck.cards.length,
        mastered,
        learning,
        new: newCards,
        dueNow,
        streak: 0, // compute from sessions if needed
      },
    }
  })

  return NextResponse.json(decksWithStats)
}

// POST /api/flashcards/rate — update card after review
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.user.id

  const body = await request.json() as {
    cardId: string
    rating: 'again' | 'hard' | 'good' | 'easy'
  }

  const card = await prisma.flashcard.findFirst({
    where: { id: body.cardId, deck: { userId } },
  })

  if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 })

  // SRS scheduling (SM-2 simplified)
  const intervals: Record<string, number> = {
    again: 1,    // 1 day
    hard: 3,     // 3 days
    good: 7,     // 7 days
    easy: 21,    // 21 days
  }

  const difficultyAdjust: Record<string, number> = {
    again: -1, hard: -0.5, good: 0, easy: 0.5,
  }

  const nextDays = intervals[body.rating]
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + nextDays)

  const newDifficulty = Math.max(1, Math.min(5, card.difficulty + difficultyAdjust[body.rating]))

  const updated = await prisma.flashcard.update({
    where: { id: body.cardId },
    data: {
      nextReview,
      reviewCount: { increment: 1 },
      difficulty: newDifficulty,
      lastResult: body.rating,
    },
  })

  // Update analytics
  const analyticsRecord = await prisma.learningAnalytics.upsert({
    where: { userId },
    update: {
      flashcardsReviewed: { increment: 1 },
      lastStudyDate: new Date(),
    },
    create: { userId, flashcardsReviewed: 1 },
  })

  await prisma.studySession.create({
    data: {
      analyticsId: analyticsRecord.id,
      duration: 1,
      activity: 'flashcard',
    },
  })

  return NextResponse.json({ updated, nextReview })
}
