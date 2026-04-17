import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { retrieveRelevantChunks } from '@/lib/ai/rag'
import { generateChatResponse } from '@/lib/ai/gemini'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const body = await request.json() as {
      sessionId?: string
      materialId?: string
      message: string
    }

    const { message, materialId } = body
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // 1. Get or create chat session
    let sessionId = body.sessionId
    let chatSession

    if (sessionId) {
      chatSession = await prisma.chatSession.findFirst({
        where: { id: sessionId, userId },
        include: {
          messages: { orderBy: { createdAt: 'desc' }, take: 10 },
        },
      })
    }

    if (!chatSession) {
      chatSession = await prisma.chatSession.create({
        data: {
          userId,
          materialId: materialId || undefined,
          title: message.slice(0, 60),
        },
        include: { messages: true },
      })
      sessionId = chatSession.id
    }

    // 2. Save the user message
    await prisma.chatMessage.create({
      data: {
        sessionId: sessionId!,
        role: 'user',
        content: message,
      },
    })

    // 3. Determine which materials to search
    let materialIds: string[] = []

    if (materialId) {
      materialIds = [materialId]
    } else {
      // Default: search all user materials that are ready
      const materials = await prisma.studyMaterial.findMany({
        where: { userId, status: 'ready' },
        select: { id: true },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      })
      materialIds = materials.map(m => m.id)
    }

    // 4. RAG: retrieve relevant chunks
    let contextChunks: Array<{ content: string; source: string; chunkIndex: number }> = []

    if (materialIds.length > 0 && process.env.GEMINI_API_KEY) {
      try {
        const retrieved = await retrieveRelevantChunks(message, materialIds, 5)
        contextChunks = retrieved.map(c => ({
          content: c.content,
          source: c.source,
          chunkIndex: c.chunkIndex,
        }))
      } catch (err) {
        console.error('[Chat] RAG retrieval failed:', err)
      }
    }

    // 5. Build conversation history
    const history = chatSession.messages
      .reverse()
      .map(m => ({ role: m.role, content: m.content }))

    // 6. Generate AI response
    let aiContent: string
    let citations: Array<{ text: string; source: string; chunkIndex: number; confidence: number }> = []

    if (process.env.GEMINI_API_KEY) {
      const result = await generateChatResponse(message, contextChunks, history)
      aiContent = result.content
      citations = result.citations
    } else {
      aiContent = `I'm StudySnap AI Tutor. To enable real AI responses, please configure your GEMINI_API_KEY environment variable.\n\nYour question: "${message}"`
    }

    // 7. Save AI response
    const aiMessage = await prisma.chatMessage.create({
      data: {
        sessionId: sessionId!,
        role: 'assistant',
        content: aiContent,
        citations: citations as any,
        tokens: Math.round(aiContent.length / 4),
      },
    })

    // 8. Update session title if first message
    if (chatSession.messages.length === 0) {
      await prisma.chatSession.update({
        where: { id: sessionId! },
        data: {
          title: message.slice(0, 60),
          updatedAt: new Date(),
        },
      })
    } else {
      await prisma.chatSession.update({
        where: { id: sessionId! },
        data: { updatedAt: new Date() },
      })
    }

    // 9. Update analytics
    await prisma.learningAnalytics.upsert({
      where: { userId },
      update: {},
      create: { userId },
    })

    return NextResponse.json({
      sessionId,
      message: {
        id: aiMessage.id,
        role: 'assistant',
        content: aiContent,
        citations: citations.map((c, i) => ({
          id: `c${i}`,
          text: c.text,
          source: c.source,
          page: undefined,
          confidence: c.confidence,
        })),
        timestamp: aiMessage.createdAt,
        tokens: aiMessage.tokens,
      },
    })
  } catch (err) {
    console.error('[Chat]', err)
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 })
  }
}

// GET /api/chat — list sessions
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sessions = await prisma.chatSession.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    take: 20,
    include: {
      _count: { select: { messages: true } },
    },
  })

  return NextResponse.json(sessions)
}
