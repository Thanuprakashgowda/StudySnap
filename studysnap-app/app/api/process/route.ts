import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { transcribeFile } from '@/lib/ai/transcription'
import { extractText } from '@/lib/ai/ocr'
import { indexMaterial } from '@/lib/ai/rag'
import { generateNotes, generateQuiz, generateFlashcards } from '@/lib/ai/gemini'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 min for long videos

const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || 'dev-secret'

function setProgress(materialId: string, progress: number, status?: string) {
  return prisma.studyMaterial.update({
    where: { id: materialId },
    data: { processingProgress: progress, ...(status ? { status } : {}) },
  })
}

export async function POST(request: NextRequest) {
  // Internal-only endpoint
  const secret = request.headers.get('x-internal-secret')
  if (secret !== INTERNAL_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json() as {
    materialId: string
    fileUrl: string
    filename: string
    fileType: string
    subject: string
    language: string
    autoQuiz: boolean
    autoFlash: boolean
  }

  const { materialId, fileUrl, filename, fileType, subject, language, autoQuiz, autoFlash } = body

  const material = await prisma.studyMaterial.findUnique({ where: { id: materialId } })
  if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404 })

  try {
    // ── STEP 1: Extract text (OCR or Transcription) ───────────────────────────
    await setProgress(materialId, 15)

    let transcription = ''
    let pageCount: number | undefined
    let duration: number | undefined

    if (fileType === 'video' || fileType === 'audio') {
      // Whisper transcription
      await setProgress(materialId, 20)
      const result = await transcribeFile(fileUrl, filename, language)
      transcription = result.text
      duration = result.duration
    } else if (fileType === 'pdf' || fileType === 'image') {
      // OCR
      await setProgress(materialId, 20)
      const result = await extractText(fileUrl, fileType, filename)
      transcription = result.text
      pageCount = result.pageCount
    } else if (fileType === 'url') {
      // Fetch URL content
      await setProgress(materialId, 20)
      const response = await fetch(fileUrl)
      const html = await response.text()
      // Strip HTML tags
      transcription = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    }

    // Cap transcription length
    transcription = transcription.slice(0, 100000)

    // Update with transcription
    await prisma.studyMaterial.update({
      where: { id: materialId },
      data: {
        transcription,
        pageCount,
        duration,
        wordCount: transcription.split(/\s+/).length,
        processingProgress: 35,
      },
    })

    // ── STEP 2: Generate Title (if generic) ───────────────────────────────────
    if (transcription.length > 200) {
      const titleGuess = transcription.slice(0, 500).split('\n').find(l => l.trim().length > 10) || ''
      if (titleGuess) {
        await prisma.studyMaterial.update({
          where: { id: materialId },
          data: {
            title: titleGuess.slice(0, 100).trim() || material.title,
            subject: subject || detectSubject(transcription),
          },
        })
      }
    }

    await setProgress(materialId, 40)

    // ── STEP 3: Chunk + Embed for RAG ─────────────────────────────────────────
    if (transcription.length > 100 && process.env.GEMINI_API_KEY) {
      await setProgress(materialId, 45)
      const chunkCount = await indexMaterial(materialId, transcription, material.title)
      console.log(`[Process] Indexed ${chunkCount} chunks for ${materialId}`)
    }

    await setProgress(materialId, 60)

    // ── STEP 4: Generate Notes ────────────────────────────────────────────────
    if (transcription.length > 200 && process.env.GEMINI_API_KEY) {
      await setProgress(materialId, 65)
      try {
        const generatedNote = await generateNotes(
          transcription,
          subject,
          language,
          material.title
        )

        const note = await prisma.note.create({
          data: {
            materialId,
            userId: material.userId,
            title: generatedNote.title,
            content: generatedNote.content,
            summary: generatedNote.summary,
            keyPoints: generatedNote.keyPoints,
            tags: generatedNote.tags,
            language,
          },
        })

        // Save initial version
        await prisma.noteVersion.create({
          data: {
            noteId: note.id,
            version: 1,
            content: generatedNote.content,
            editedBy: material.userId,
          },
        })

        console.log(`[Process] Note created: ${note.id}`)
      } catch (err) {
        console.error('[Process] Note generation failed:', err)
      }
    }

    await setProgress(materialId, 78)

    // ── STEP 5: Generate Quiz (optional) ─────────────────────────────────────
    if (autoQuiz && transcription.length > 500 && process.env.GEMINI_API_KEY) {
      try {
        const questions = await generateQuiz(transcription, subject, 10)

        const quiz = await prisma.quiz.create({
          data: {
            materialId,
            userId: material.userId,
            title: `${material.title.slice(0, 50)} — Quiz`,
            subject,
          },
        })

        await prisma.quizQuestion.createMany({
          data: questions.map((q, i) => ({
            quizId: quiz.id,
            type: q.type,
            question: q.question,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation,
            difficulty: q.difficulty,
            topic: q.topic,
            citationText: q.citationText,
            order: i,
          })),
        })

        console.log(`[Process] Quiz created with ${questions.length} questions`)
      } catch (err) {
        console.error('[Process] Quiz generation failed:', err)
      }
    }

    await setProgress(materialId, 90)

    // ── STEP 6: Generate Flashcards (optional) ────────────────────────────────
    if (autoFlash && transcription.length > 500 && process.env.GEMINI_API_KEY) {
      try {
        const cards = await generateFlashcards(transcription, subject, 20)

        const deck = await prisma.flashcardDeck.create({
          data: {
            materialId,
            userId: material.userId,
            title: `${material.title.slice(0, 50)} — Flashcards`,
            subject,
          },
        })

        await prisma.flashcard.createMany({
          data: cards.map(c => ({
            deckId: deck.id,
            front: c.front,
            back: c.back,
            hint: c.hint,
            topic: c.topic,
            citationText: c.citationText,
          })),
        })

        console.log(`[Process] Flashcard deck created with ${cards.length} cards`)
      } catch (err) {
        console.error('[Process] Flashcard generation failed:', err)
      }
    }

    // ── STEP 7: Mark complete ─────────────────────────────────────────────────
    await prisma.studyMaterial.update({
      where: { id: materialId },
      data: { status: 'ready', processingProgress: 100 },
    })

    // Update analytics
    await prisma.learningAnalytics.upsert({
      where: { userId: material.userId },
      update: { materialsStudied: { increment: 1 } },
      create: { userId: material.userId, materialsStudied: 1 },
    })

    console.log(`[Process] ✓ Material ${materialId} fully processed`)
    return NextResponse.json({ status: 'done', materialId })

  } catch (err) {
    console.error('[Process] Fatal error:', err)
    await prisma.studyMaterial.update({
      where: { id: materialId },
      data: {
        status: 'error',
        errorMessage: (err as Error).message,
      },
    })
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}

// ─── Simple subject detection ─────────────────────────────────────────────────
function detectSubject(text: string): string {
  const lower = text.toLowerCase()
  const subjects: Record<string, string[]> = {
    'Biology': ['dna', 'cell', 'protein', 'organism', 'evolution', 'gene', 'enzyme'],
    'Physics': ['force', 'energy', 'quantum', 'wave', 'particle', 'relativity', 'electron'],
    'Chemistry': ['molecule', 'reaction', 'compound', 'bond', 'atom', 'oxidation'],
    'Mathematics': ['equation', 'derivative', 'integral', 'matrix', 'theorem', 'proof'],
    'Economics': ['market', 'gdp', 'inflation', 'supply', 'demand', 'fiscal', 'monetary'],
    'History': ['war', 'century', 'civilization', 'empire', 'revolution', 'historical'],
    'Computer Science': ['algorithm', 'function', 'data structure', 'code', 'program'],
    'Literature': ['novel', 'poem', 'author', 'metaphor', 'narrative', 'character'],
  }

  for (const [subject, keywords] of Object.entries(subjects)) {
    const hits = keywords.filter(kw => lower.includes(kw)).length
    if (hits >= 3) return subject
  }
  return 'General'
}
