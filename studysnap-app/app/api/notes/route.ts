import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'

// GET /api/notes — list user's notes
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const materialId = searchParams.get('materialId')
  const query = searchParams.get('q')

  const notes = await prisma.note.findMany({
    where: {
      userId: session.user.id,
      ...(materialId ? { materialId } : {}),
      ...(query ? {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
        ],
      } : {}),
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      citations: true,
      material: { select: { title: true, subject: true, fileType: true } },
    },
  })

  return NextResponse.json(notes)
}

// PATCH /api/notes — update note content
export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as {
    noteId: string
    content?: string
    title?: string
    tags?: string[]
    isFavorite?: boolean
  }

  const note = await prisma.note.findFirst({
    where: { id: body.noteId, userId: session.user.id },
  })

  if (!note) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Save version if content changed
  if (body.content && body.content !== note.content) {
    await prisma.noteVersion.create({
      data: {
        noteId: note.id,
        version: note.version + 1,
        content: body.content,
        editedBy: session.user.id,
      },
    })
  }

  const updated = await prisma.note.update({
    where: { id: body.noteId },
    data: {
      ...(body.content ? { content: body.content, isEdited: true, version: { increment: 1 } } : {}),
      ...(body.title ? { title: body.title } : {}),
      ...(body.tags ? { tags: body.tags } : {}),
      ...(body.isFavorite !== undefined ? { isFavorite: body.isFavorite } : {}),
    },
  })

  return NextResponse.json(updated)
}

// DELETE /api/notes?id=xxx
export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const noteId = searchParams.get('id')
  if (!noteId) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await prisma.note.deleteMany({ where: { id: noteId, userId: session.user.id } })
  return NextResponse.json({ message: 'Note deleted' })
}
