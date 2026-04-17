import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'

// GET /api/user/export — GDPR data export
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id

  const [user, materials, notes, quizzes, attempts, flashcardDecks, chatSessions, analytics] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true, role: true, plan: true },
    }),
    prisma.studyMaterial.findMany({
      where: { userId },
      include: { _count: { select: { notes: true, quizzes: true } } },
    }),
    prisma.note.findMany({
      where: { userId },
      include: { citations: true },
    }),
    prisma.quiz.findMany({
      where: { userId },
      include: { questions: true, attempts: { where: { userId } } },
    }),
    prisma.quizAttempt.findMany({ where: { userId } }),
    prisma.flashcardDeck.findMany({
      where: { userId },
      include: { cards: true },
    }),
    prisma.chatSession.findMany({
      where: { userId },
      include: { messages: true },
    }),
    prisma.learningAnalytics.findUnique({
      where: { userId },
      include: { sessions: true, subjectStats: true },
    }),
  ])

  const exportData = {
    exportedAt: new Date().toISOString(),
    platform: 'StudySnap+',
    version: '1.0',
    user,
    statistics: {
      totalMaterials: materials.length,
      totalNotes: notes.length,
      totalQuizzes: quizzes.length,
      totalFlashcardDecks: flashcardDecks.length,
      totalChatMessages: chatSessions.reduce((a, s) => a + s.messages.length, 0),
      totalStudyTime: analytics?.totalStudyTime || 0,
    },
    materials,
    notes,
    quizzes,
    flashcardDecks,
    chatSessions,
    analytics,
  }

  const json = JSON.stringify(exportData, null, 2)
  const filename = `studysnap-export-${user?.email?.replace('@', '-')}-${new Date().toISOString().split('T')[0]}.json`

  return new NextResponse(json, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

// DELETE /api/user — GDPR account deletion
export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id

  const body = await request.json() as { confirm: string }
  if (body.confirm !== 'DELETE_MY_ACCOUNT') {
    return NextResponse.json({ error: 'Confirmation text required' }, { status: 400 })
  }

  // Delete user — cascade deletes all related data via Prisma schema
  await prisma.user.delete({ where: { id: userId } })

  return NextResponse.json({
    message: 'Account and all associated data deleted. Per GDPR Article 17, deletion is complete.',
    deletedAt: new Date().toISOString(),
  })
}
