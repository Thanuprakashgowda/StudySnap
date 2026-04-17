import prisma from '@/lib/db'
import { generateEmbedding, generateBatchEmbeddings } from '@/lib/ai/gemini'

// ─── Chunk text into overlapping segments ──────────────────────────────────────
export function chunkText(
  text: string,
  chunkSize: number = 512,
  overlapSize: number = 64
): Array<{ content: string; startChar: number; endChar: number }> {
  const chunks: Array<{ content: string; startChar: number; endChar: number }> = []
  const words = text.split(/\s+/)

  let i = 0
  let charOffset = 0

  while (i < words.length) {
    const chunkWords = words.slice(i, i + chunkSize)
    const content = chunkWords.join(' ')
    const startChar = text.indexOf(chunkWords[0], charOffset)
    const endChar = startChar + content.length

    chunks.push({ content, startChar: Math.max(0, startChar), endChar })

    charOffset = startChar + content.length
    i += chunkSize - overlapSize // overlap
  }

  return chunks
}

// ─── Index a material's transcription into vector store ──────────────────────
export async function indexMaterial(
  materialId: string,
  transcription: string,
  sourceTitle: string
): Promise<number> {
  // 1. Delete existing chunks
  await prisma.materialChunk.deleteMany({ where: { materialId } })

  // 2. Chunk the text
  const rawChunks = chunkText(transcription, 512, 64)

  if (rawChunks.length === 0) return 0

  // 3. Batch generate embeddings (max 20 at a time to avoid rate limits)
  const BATCH_SIZE = 20
  const allEmbeddings: number[][] = []

  for (let i = 0; i < rawChunks.length; i += BATCH_SIZE) {
    const batch = rawChunks.slice(i, i + BATCH_SIZE).map(c => c.content)
    const embeddings = await generateBatchEmbeddings(batch)
    allEmbeddings.push(...embeddings)
    // Rate limit: 20 req/s for embeddings
    if (i + BATCH_SIZE < rawChunks.length) {
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  // 4. Store chunks with embeddings
  await prisma.materialChunk.createMany({
    data: rawChunks.map((chunk, index) => ({
      materialId,
      content: chunk.content,
      chunkIndex: index,
      startChar: chunk.startChar,
      endChar: chunk.endChar,
      embedding: allEmbeddings[index] as unknown as Record<string, unknown>,
      metadata: { source: sourceTitle },
    })),
  })

  return rawChunks.length
}

// ─── Cosine similarity ────────────────────────────────────────────────────────
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  let dot = 0, magA = 0, magB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    magA += a[i] ** 2
    magB += b[i] ** 2
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB)
  return denom === 0 ? 0 : dot / denom
}

// ─── Retrieve similar chunks for a query ──────────────────────────────────────
export interface RetrievedChunk {
  content: string
  source: string
  chunkIndex: number
  similarity: number
  materialId: string
}

export async function retrieveRelevantChunks(
  query: string,
  materialIds: string[],
  topK: number = 5,
  minSimilarity: number = 0.45
): Promise<RetrievedChunk[]> {
  // 1. Embed the query
  const queryEmbedding = await generateEmbedding(query)

  // 2. Load all chunks for the given materials
  const chunks = await prisma.materialChunk.findMany({
    where: { materialId: { in: materialIds } },
    include: { material: { select: { title: true } } },
  })

  if (chunks.length === 0) return []

  // 3. Compute cosine similarity for each chunk
  const scored = chunks
    .map(chunk => {
      const embedding = chunk.embedding as unknown as number[]
      const similarity = cosineSimilarity(queryEmbedding, embedding)
      return {
        content: chunk.content,
        source: chunk.material.title,
        chunkIndex: chunk.chunkIndex,
        similarity,
        materialId: chunk.materialId,
      }
    })
    .filter(c => c.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)

  return scored
}

// ─── Build context string from chunks ────────────────────────────────────────
export function buildContext(chunks: RetrievedChunk[]): string {
  return chunks
    .map((c, i) => `[Source ${i + 1} — ${c.source} | similarity: ${c.similarity.toFixed(2)}]\n${c.content}`)
    .join('\n\n---\n\n')
}
