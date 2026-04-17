import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { uploadToBlob, getContentType, getFileType } from '@/lib/storage'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    // 2. Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const urlImport = formData.get('url') as string | null
    const subject = (formData.get('subject') as string) || ''
    const language = (formData.get('language') as string) || 'en'
    const autoQuiz = formData.get('autoQuiz') === 'true'
    const autoFlash = formData.get('autoFlash') === 'true'

    if (!file && !urlImport) {
      return NextResponse.json({ error: 'File or URL required' }, { status: 400 })
    }

    let fileUrl: string
    let filename: string
    let fileSize: number
    let fileType: ReturnType<typeof getFileType>
    let contentType: string

    if (file) {
      filename = file.name
      fileSize = file.size
      fileType = getFileType(filename)
      contentType = getContentType(filename)

      // 3a. Upload to Vercel Blob
      const uploadResult = await uploadToBlob(
        file,
        `${userId}/${Date.now()}-${filename}`,
        contentType
      )
      fileUrl = uploadResult.url
    } else {
      // URL import
      filename = new URL(urlImport!).hostname
      fileSize = 0
      fileType = 'url'
      contentType = 'text/html'
      fileUrl = urlImport!
    }

    // 4. Create material record (status: uploading → processing → ready)
    const material = await prisma.studyMaterial.create({
      data: {
        userId,
        title: filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        subject,
        language,
        fileType,
        fileSize,
        fileUrl,
        originalName: filename,
        status: 'processing',
        processingProgress: 10,
        sourceUrl: urlImport || undefined,
      },
    })

    // 5. Trigger async processing (fire-and-forget)
    // In production, use a queue (Vercel Queue, BullMQ, etc.)
    // For now, call the process endpoint in the background
    const processUrl = new URL('/api/process', request.url).toString()
    fetch(processUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Pass internal secret to allow direct call
        'x-internal-secret': process.env.INTERNAL_API_SECRET || 'dev-secret',
      },
      body: JSON.stringify({
        materialId: material.id,
        fileUrl,
        filename,
        fileType,
        subject,
        language,
        autoQuiz,
        autoFlash,
      }),
    }).catch(err => console.error('[Upload] Process trigger failed:', err))

    return NextResponse.json({
      materialId: material.id,
      status: 'processing',
      message: 'Upload successful. Processing started.',
      fileUrl,
    })
  } catch (err) {
    console.error('[Upload]', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// GET /api/upload?materialId=xxx → check processing status
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const materialId = searchParams.get('materialId')

  if (!materialId) {
    return NextResponse.json({ error: 'materialId required' }, { status: 400 })
  }

  const material = await prisma.studyMaterial.findFirst({
    where: { id: materialId, userId: session.user.id },
    select: {
      id: true,
      status: true,
      processingProgress: true,
      title: true,
      errorMessage: true,
    },
  })

  if (!material) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(material)
}
