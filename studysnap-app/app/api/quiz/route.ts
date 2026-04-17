import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'

// GET /api/quiz — list quizzes
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const materialId = searchParams.get('materialId')

  const quizzes = await prisma.quiz.findMany({
    where: {
      userId: session.user.id,
      ...(materialId ? { materialId } : {}),
    },
    include: {
      questions: true,
      attempts: {
        where: { userId: session.user.id },
        orderBy: { completedAt: 'desc' },
        take: 5,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(quizzes)
}

// POST /api/quiz/attempt — record quiz attempt + score
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.user.id

  const body = await request.json() as {
    quizId: string
    answers: Record<string, string>
    timeSpent: number
  }

  const quiz = await prisma.quiz.findFirst({
    where: { id: body.quizId },
    include: { questions: true },
  })

  if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })

  // Calculate score
  let correct = 0
  for (const question of quiz.questions) {
    if (body.answers[question.id] === question.answer) {
      correct++
      // Update question stats
      await prisma.quizQuestion.update({
        where: { id: question.id },
        data: { timesSeen: { increment: 1 }, timesCorrect: { increment: 1 } },
      })
    } else {
      await prisma.quizQuestion.update({
        where: { id: question.id },
        data: { timesSeen: { increment: 1 } },
      })
    }
  }

  const score = Math.round((correct / quiz.questions.length) * 100)

  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId: body.quizId,
      userId,
      answers: body.answers,
      score,
      totalQuestions: quiz.questions.length,
      correct,
      timeSpent: body.timeSpent,
    },
  })

  // Update analytics
  const analyticsRecord = await prisma.learningAnalytics.upsert({
    where: { userId },
    update: { lastStudyDate: new Date() },
    create: { userId },
  })

  await prisma.studySession.create({
    data: {
      analyticsId: analyticsRecord.id,
      duration: Math.round(body.timeSpent / 60),
      activity: 'quiz',
      quizScore: score,
    },
  })

  // Run re-average
  const allAttempts = await prisma.quizAttempt.aggregate({
    where: { userId },
    _avg: { score: true },
  })

  await prisma.learningAnalytics.update({
    where: { userId },
    data: { averageScore: allAttempts._avg.score || score },
  })

  return NextResponse.json({ attemptId: attempt.id, score, correct, total: quiz.questions.length })
}
