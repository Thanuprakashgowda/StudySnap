import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'

// GET /api/materials — list user's materials
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const subject = searchParams.get('subject')
  const limit = parseInt(searchParams.get('limit') || '50')

  const materials = await prisma.studyMaterial.findMany({
    where: {
      userId: session.user.id,
      ...(status ? { status } : {}),
      ...(subject ? { subject } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      _count: { select: { notes: true, quizzes: true, flashcardDecks: true } },
    },
  })

  return NextResponse.json(materials)
}

// DELETE /api/materials?id=xxx — delete a material + all related content
export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const materialId = searchParams.get('id')
  if (!materialId) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }

  const material = await prisma.studyMaterial.findFirst({
    where: { id: materialId, userId: session.user.id },
  })

  if (!material) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Cascade deletes handle related data via Prisma schema
  await prisma.studyMaterial.delete({ where: { id: materialId } })

  // Optionally delete from blob storage
  // await deleteBlob(material.fileUrl)

  return NextResponse.json({ message: 'Material deleted' })
}
