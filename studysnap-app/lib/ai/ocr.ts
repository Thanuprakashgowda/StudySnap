import { fetchBlobAsBuffer } from '@/lib/storage'
import { getProModel } from '@/lib/ai/gemini'

// ─── OCR Result ───────────────────────────────────────────────────────────────
export type OcrResult = {
  text: string
  pageCount: number
  wordCount: number
  pages?: string[]
}

// ─── PDF text extraction (no OCR needed if text-based) ───────────────────────
export async function extractPdfText(fileUrl: string): Promise<OcrResult> {
  try {
    // Dynamic import to avoid SSR and CJS/ESM interop issues
    const pdf = await import('pdf-parse')
    const pdfParse = (pdf as any).default || pdf
    const buffer = await fetchBlobAsBuffer(fileUrl)
    const data = await pdfParse(buffer)

    return {
      text: data.text,
      pageCount: data.numpages,
      wordCount: data.text.split(/\s+/).length,
    }
  } catch (err) {
    console.error('[OCR] pdf-parse failed:', err)
    throw new Error('Failed to extract PDF text')
  }
}

/**
 * Google Document AI OCR
 * Used for scanned PDFs and images
 */
export async function extractWithGoogleDocumentAI(
  fileUrl: string,
  mimeType: string = 'application/pdf'
): Promise<OcrResult> {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
  const processorId = process.env.GOOGLE_DOCUMENT_AI_PROCESSOR_ID
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY

  if (!projectId || !processorId || !apiKey) {
    throw new Error('Google Document AI not configured')
  }

  const buffer = await fetchBlobAsBuffer(fileUrl)
  const base64Content = buffer.toString('base64')

  const endpoint = `https://documentai.googleapis.com/v1/projects/${projectId}/locations/us/processors/${processorId}:process?key=${apiKey}`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rawDocument: {
        content: base64Content,
        mimeType,
      },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Document AI error: ${err}`)
  }

  const data = await response.json() as {
    document?: {
      text?: string
      pages?: Array<{ pageNumber: number }>
    }
  }

  const text = data.document?.text || ''
  const pageCount = data.document?.pages?.length || 1

  return {
    text,
    pageCount,
    wordCount: text.split(/\s+/).length,
  }
}

/**
 * Gemini Vision OCR fallback — use Gemini to extract text from images
 */
export async function extractWithGeminiVision(
  fileUrl: string,
  mimeType: string = 'image/jpeg'
): Promise<OcrResult> {
  const model = getProModel()
  const buffer = await fetchBlobAsBuffer(fileUrl)

  const result = await model.generateContent([
    {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType,
      },
    },
    `Extract ALL text from this image/document. Return only the raw text content, preserving structure (headings, lists, paragraphs). Do not add any commentary.`,
  ])

  const text = result.response.text()

  return {
    text,
    pageCount: 1,
    wordCount: text.split(/\s+/).length,
  }
}

/**
 * Master OCR function — auto-selects the best method
 */
export async function extractText(
  fileUrl: string,
  fileType: string,
  filename: string
): Promise<OcrResult> {
  const mimeType = getMimeType(filename)

  // Text-based PDFs → use pdf-parse (fast, accurate, free)
  if (fileType === 'pdf') {
    try {
      const result = await extractPdfText(fileUrl)
      // If meaningful text was extracted, use it
      if (result.wordCount > 50) return result
      // Otherwise, it's likely a scanned PDF → use OCR
    } catch {
      console.log('[OCR] pdf-parse failed, falling back to Document AI')
    }
  }

  // Images and scanned PDFs → try Google Document AI first
  if (process.env.GOOGLE_DOCUMENT_AI_PROCESSOR_ID) {
    try {
      return await extractWithGoogleDocumentAI(fileUrl, mimeType)
    } catch (err) {
      console.error('[OCR] Document AI failed, trying Gemini Vision:', err)
    }
  }

  // Gemini Vision fallback for images
  if (fileType === 'image' && process.env.GEMINI_API_KEY) {
    try {
      return await extractWithGeminiVision(fileUrl, mimeType)
    } catch (err) {
      console.error('[OCR] Gemini Vision failed:', err)
    }
  }

  // Last resort: return empty
  return { text: '', pageCount: 1, wordCount: 0 }
}

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const map: Record<string, string> = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg', jpeg: 'image/jpeg',
    png: 'image/png', webp: 'image/webp',
    gif: 'image/gif', tiff: 'image/tiff',
  }
  return map[ext] || 'application/pdf'
}
