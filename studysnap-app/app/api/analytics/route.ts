import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'

// GET /api/analytics — user learning metrics
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id

  // Ensure analytics record exists
  const analytics = await prisma.learningAnalytics.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      sessions: {
        orderBy: { date: 'desc' },
        take: 30,
      },
      subjectStats: {
        orderBy: { score: 'desc' },
      },
    },
  })

  // Calculate streak
  const now = new Date()
  const lastStudy = analytics.lastStudyDate
  let streak = analytics.streak
  if (lastStudy) {
    const daysSince = Math.floor((now.getTime() - lastStudy.getTime()) / 86400000)
    if (daysSince > 1) streak = 0
  }

  // Build study time chart (last 7 days)
  const studyTime: Array<{ date: string; value: number }> = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayMinutes = analytics.sessions
      .filter(s => s.date.toISOString().split('T')[0] === dateStr && s.activity === 'study')
      .reduce((acc, s) => acc + s.duration, 0)
    studyTime.push({ date: dateStr, value: dayMinutes })
  }

  // Build quiz score chart (last 7 days)
  const quizScores: Array<{ date: string; value: number }> = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayScores = analytics.sessions
      .filter(s => s.date.toISOString().split('T')[0] === dateStr && s.quizScore !== null)
      .map(s => s.quizScore!)
    const avg = dayScores.length > 0 ? Math.round(dayScores.reduce((a, b) => a + b, 0) / dayScores.length) : 0
    quizScores.push({ date: dateStr, value: avg })
  }

  // Counts
  const [noteCount, quizCount, flashcardCount, attemptStats] = await Promise.all([
    prisma.note.count({ where: { userId } }),
    prisma.quiz.count({ where: { userId } }),
    prisma.flashcard.count({ where: { deck: { userId } } }),
    prisma.quizAttempt.aggregate({
      where: { userId },
      _avg: { score: true },
      _count: true,
    }),
  ])

  const topSubjects = analytics.subjectStats.slice(0, 5).map(s => ({
    subject: s.subject,
    score: Math.round(s.score),
    time: s.time,
  }))

  return NextResponse.json({
    streak,
    lastStudyDate: analytics.lastStudyDate,
    totalStudyTime: analytics.totalStudyTime,
    materialsStudied: analytics.materialsStudied,
    notesCreated: noteCount,
    flashcardsReviewed: analytics.flashcardsReviewed,
    quizzesTaken: attemptStats._count || 0,
    averageScore: Math.round(attemptStats._avg.score || analytics.averageScore),
    learningVelocity: analytics.learningVelocity,
    studyTime,
    quizScores,
    topSubjects,
    // Placeholder until we compute from quiz results
    weakAreas: [],
    strengths: [],
  })
}

// POST /api/analytics/session — record a study session
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id

  const body = await request.json() as {
    duration: number
    activity: string
    quizScore?: number
    subject?: string
  }

  const analytics = await prisma.learningAnalytics.upsert({
    where: { userId },
    update: {
      totalStudyTime: { increment: body.duration },
      flashcardsReviewed: body.activity === 'flashcard' ? { increment: 1 } : undefined,
      lastStudyDate: new Date(),
    },
    create: { userId, totalStudyTime: body.duration },
  })

  await prisma.studySession.create({
    data: {
      analyticsId: analytics.id,
      duration: body.duration,
      activity: body.activity,
      quizScore: body.quizScore,
    },
  })

  return NextResponse.json({ recorded: true })
}
