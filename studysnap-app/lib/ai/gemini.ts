import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  console.warn('[Gemini] GEMINI_API_KEY not set. AI features will be unavailable.')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder')

// Safety settings — allow educational content
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
]

// ─── Models ───────────────────────────────────────────────────────────────────
export const getFlashModel = () =>
  genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: SAFETY_SETTINGS,
    generationConfig: { temperature: 0.4, topP: 0.9, maxOutputTokens: 8192 },
  })

export const getProModel = () =>
  genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    safetySettings: SAFETY_SETTINGS,
    generationConfig: { temperature: 0.3, topP: 0.85, maxOutputTokens: 16384 },
  })

export const getEmbeddingModel = () =>
  genAI.getGenerativeModel({ model: 'text-embedding-004' })

// ─── Generate text embeddings ─────────────────────────────────────────────────
export async function generateEmbedding(text: string): Promise<number[]> {
  const model = getEmbeddingModel()
  const result = await model.embedContent(text)
  return result.embedding.values
}

export async function generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
  const model = getEmbeddingModel()
  const results = await Promise.all(texts.map(t => model.embedContent(t)))
  return results.map(r => r.embedding.values)
}

// ─── Note generation ──────────────────────────────────────────────────────────
export interface GeneratedNote {
  title: string
  content: string
  summary: string
  keyPoints: string[]
  tags: string[]
}

export async function generateNotes(
  transcription: string,
  subject: string,
  language: string,
  materialTitle: string
): Promise<GeneratedNote> {
  const model = getProModel()

  const prompt = `You are an expert academic note-taker. Generate comprehensive, well-structured study notes from the following content.

Material: "${materialTitle}"
Subject: ${subject || 'General'}
Output Language: ${language}

CONTENT:
${transcription.slice(0, 50000)} // Truncate to avoid token limits

INSTRUCTIONS:
1. Create detailed markdown notes with clear headings (# ## ###)
2. Include key concepts, definitions, formulas, and examples
3. Use bullet points and numbered lists where appropriate
4. Bold (**) important terms
5. Add a summary and key points

RESPOND WITH VALID JSON ONLY:
{
  "title": "concise note title",
  "content": "full markdown content with ## headings, **bold** terms, and - bullet points",
  "summary": "2-3 sentence summary of the core topic",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "tags": ["tag1", "tag2", "tag3"]
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Failed to parse note generation response')

  return JSON.parse(jsonMatch[0]) as GeneratedNote
}

// ─── Quiz generation ──────────────────────────────────────────────────────────
export interface GeneratedQuizQuestion {
  type: 'mcq' | 'true-false'
  question: string
  options: string[]
  answer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  citationText: string
  citationPage?: number
}

export async function generateQuiz(
  transcription: string,
  subject: string,
  count: number = 10
): Promise<GeneratedQuizQuestion[]> {
  const model = getFlashModel()

  const prompt = `You are an expert educator creating an adaptive quiz. Generate ${count} varied quiz questions from the content.

Subject: ${subject || 'General'}
Content length: ${transcription.length} characters

CONTENT:
${transcription.slice(0, 40000)}

REQUIREMENTS:
- Mix of easy (40%), medium (40%), hard (20%) questions
- Mostly MCQ (4 options), some true/false
- Each question must be directly answerable from the content
- Explanations must reference specific parts of the content
- Include the source text quote in citationText

RESPOND WITH VALID JSON ARRAY ONLY:
[
  {
    "type": "mcq",
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "answer": "exact option text",
    "explanation": "clear explanation referencing the source",
    "difficulty": "easy|medium|hard",
    "topic": "sub-topic name",
    "citationText": "exact quote from source that supports the answer",
    "citationPage": null
  }
]`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Failed to parse quiz generation response')

  return JSON.parse(jsonMatch[0]) as GeneratedQuizQuestion[]
}

// ─── Flashcard generation ─────────────────────────────────────────────────────
export interface GeneratedFlashcard {
  front: string
  back: string
  hint?: string
  topic: string
  citationText: string
}

export async function generateFlashcards(
  transcription: string,
  subject: string,
  count: number = 20
): Promise<GeneratedFlashcard[]> {
  const model = getFlashModel()

  const prompt = `You are a spaced repetition expert. Create ${count} flashcards from the following content.

Subject: ${subject || 'General'}

CONTENT:
${transcription.slice(0, 40000)}

REQUIREMENTS:
- Front: a clear, concise question or term
- Back: complete, accurate answer (2-4 sentences max)
- Hint: optional memory aid or mnemonic
- Cover key terms, concepts, processes, and facts
- Group by sub-topics

RESPOND WITH VALID JSON ARRAY ONLY:
[
  {
    "front": "What is ...?",
    "back": "Complete answer...",
    "hint": "optional memory tip",
    "topic": "sub-topic",
    "citationText": "source text supporting this card"
  }
]`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Failed to parse flashcard generation response')

  return JSON.parse(jsonMatch[0]) as GeneratedFlashcard[]
}

// ─── Single-turn chat (non-streaming) ─────────────────────────────────────────
export async function generateChatResponse(
  question: string,
  contextChunks: Array<{ content: string; source: string; chunkIndex: number }>,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<{ content: string; citations: Array<{ text: string; source: string; chunkIndex: number; confidence: number }> }> {
  const model = getFlashModel()

  const contextText = contextChunks
    .map((c, i) => `[SOURCE ${i + 1} — ${c.source}]\n${c.content}`)
    .join('\n\n---\n\n')

  const historyText = conversationHistory
    .slice(-6) // last 3 turns
    .map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
    .join('\n')

  const prompt = `You are an expert AI tutor. Answer ONLY based on the provided source material. Always cite your source.

CONVERSATION HISTORY:
${historyText || '(new conversation)'}

RETRIEVED SOURCE MATERIAL:
${contextText || '(no relevant content found — ask student to upload relevant material)'}

STUDENT QUESTION: ${question}

INSTRUCTIONS:
- Answer thoroughly and clearly using the source material above
- If the answer is not in the sources, say so explicitly
- Use markdown formatting (bold, lists, code blocks where relevant)
- End with a [CITATIONS] block listing which sources you used

FORMAT:
Your detailed answer here...

[CITATIONS]
source_index: confidence (0.0-1.0) | quote: "exact text from source"`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  // Parse citations from response
  const [mainContent, citationBlock] = text.split('[CITATIONS]')

  const citations: Array<{ text: string; source: string; chunkIndex: number; confidence: number }> = []

  if (citationBlock) {
    const lines = citationBlock.trim().split('\n').filter(Boolean)
    for (const line of lines) {
      const match = line.match(/(\d+):\s*([\d.]+).*quote:\s*"([^"]+)"/)
      if (match) {
        const idx = parseInt(match[1]) - 1
        if (contextChunks[idx]) {
          citations.push({
            text: match[3],
            source: contextChunks[idx].source,
            chunkIndex: contextChunks[idx].chunkIndex,
            confidence: parseFloat(match[2]),
          })
        }
      }
    }
  }

  return {
    content: mainContent.trim(),
    citations,
  }
}

// ─── Streaming chat (for SSE) ─────────────────────────────────────────────────
export async function* streamChatResponse(
  question: string,
  contextChunks: Array<{ content: string; source: string }>
): AsyncGenerator<string> {
  const model = getFlashModel()

  const contextText = contextChunks
    .map((c, i) => `[SOURCE ${i + 1}]\n${c.content}`)
    .join('\n\n')

  const prompt = `You are an expert AI tutor. Use ONLY the provided sources to answer.

SOURCES:
${contextText}

QUESTION: ${question}

Answer with markdown formatting and cite sources inline as [Source N].`

  const result = await model.generateContentStream(prompt)

  for await (const chunk of result.stream) {
    const text = chunk.text()
    if (text) yield text
  }
}
