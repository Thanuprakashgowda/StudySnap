import OpenAI from 'openai'
import { fetchBlobAsBuffer } from '@/lib/storage'

// ─── Transcription using OpenAI Whisper ──────────────────────────────────────
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })

export type TranscriptionResult = {
  text: string
  language: string
  duration?: number
  words?: Array<{ word: string; start: number; end: number }>
}

/**
 * Transcribe audio/video using OpenAI Whisper API
 * Supports: mp3, mp4, mpeg, mpga, m4a, wav, webm
 */
export async function transcribeWithWhisper(
  fileUrl: string,
  filename: string,
  language?: string
): Promise<TranscriptionResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  // Fetch the file from Vercel Blob
  const buffer = await fetchBlobAsBuffer(fileUrl)

  // Create a File object for the Whisper API
  const file = new File([buffer as any], filename, {
    type: getMimeTypeForWhisper(filename),
  })

  const response = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language: language && language !== 'en' ? language : undefined,
    response_format: 'verbose_json',
    timestamp_granularities: ['word'],
  })

  return {
    text: response.text,
    language: response.language || language || 'en',
    duration: response.duration || undefined,
    words: response.words?.map(w => ({
      word: w.word,
      start: w.start,
      end: w.end,
    })),
  }
}

/**
 * Transcribe using Google Cloud Speech-to-Text (for long audio)
 * Falls back to Whisper if Google credentials not available
 */
export async function transcribeWithGoogle(
  fileUrl: string,
  language: string = 'en-US'
): Promise<TranscriptionResult> {
  const googleKey = process.env.GOOGLE_CLOUD_API_KEY
  if (!googleKey) {
    throw new Error('GOOGLE_CLOUD_API_KEY not configured')
  }

  const buffer = await fetchBlobAsBuffer(fileUrl)
  const audioBase64 = buffer.toString('base64')

  const requestBody = {
    config: {
      languageCode: language.includes('-') ? language : `${language}-US`,
      enableAutomaticPunctuation: true,
      enableWordTimeOffsets: true,
      model: 'latest_long',
    },
    audio: { content: audioBase64 },
  }

  const response = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${googleKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Google Speech-to-Text error: ${err}`)
  }

  const data = await response.json() as {
    results?: Array<{
      alternatives: Array<{
        transcript: string
        words?: Array<{ word: string; startTime: string; endTime: string }>
      }>
    }>
  }

  const text = data.results
    ?.map(r => r.alternatives[0]?.transcript || '')
    .join('\n') || ''

  return { text, language }
}

/**
 * Auto-select transcription provider based on available keys
 */
export async function transcribeFile(
  fileUrl: string,
  filename: string,
  language: string = 'en'
): Promise<TranscriptionResult> {
  // Prefer Whisper (better accuracy, simpler setup)
  if (process.env.OPENAI_API_KEY) {
    return transcribeWithWhisper(fileUrl, filename, language)
  }
  // Fall back to Google Cloud
  if (process.env.GOOGLE_CLOUD_API_KEY) {
    return transcribeWithGoogle(fileUrl, language)
  }
  // No transcription service available — return empty
  console.warn('[Transcription] No API keys configured. Returning empty transcription.')
  return { text: '', language }
}

// ─── Helper: get MIME type supported by Whisper ───────────────────────────────
function getMimeTypeForWhisper(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const map: Record<string, string> = {
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    mpeg: 'audio/mpeg',
    mpga: 'audio/mpeg',
    m4a: 'audio/mp4',
    ogg: 'audio/ogg',
    wav: 'audio/wav',
    webm: 'audio/webm',
    mov: 'video/quicktime',
  }
  return map[ext] || 'audio/mpeg'
}
