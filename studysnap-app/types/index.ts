// ─── Core Types ───────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'student' | 'teacher' | 'admin'
  plan: 'free' | 'pro' | 'team'
  language: string
  createdAt: string
  settings: UserSettings
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system'
  language: string
  notifications: boolean
  emailDigest: boolean
  autoTranscribe: boolean
  defaultSubject: string
  exportFormat: 'pdf' | 'docx' | 'md'
  accessibility: {
    highContrast: boolean
    fontSize: 'sm' | 'md' | 'lg'
    reduceMotion: boolean
  }
}

// ─── Study Materials ──────────────────────────────────────────────────────────

export interface StudyMaterial {
  id: string
  userId: string
  title: string
  subject: string
  description?: string
  fileType: 'pdf' | 'video' | 'audio' | 'text' | 'image' | 'url'
  fileSize: number
  fileUrl: string
  transcription?: string
  language: string
  tags: string[]
  status: 'uploading' | 'processing' | 'ready' | 'error'
  processingProgress?: number
  sharedWith: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
  metadata: {
    duration?: number
    pageCount?: number
    wordCount?: number
    sourceUrl?: string
  }
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export interface Note {
  id: string
  materialId: string
  userId: string
  title: string
  content: string
  summary: string
  keyPoints: string[]
  citations: Citation[]
  tags: string[]
  language: string
  isEdited: boolean
  isFavorite: boolean
  collaborators: string[]
  createdAt: string
  updatedAt: string
  version: number
  history: NoteVersion[]
}

export interface NoteVersion {
  version: number
  content: string
  editedAt: string
  editedBy: string
}

export interface Citation {
  id: string
  text: string
  source: string
  page?: number
  timestamp?: number
  confidence: number
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface Quiz {
  id: string
  materialId: string
  userId: string
  title: string
  subject: string
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive'
  questions: QuizQuestion[]
  settings: QuizSettings
  attempts: QuizAttempt[]
  createdAt: string
  tags: string[]
}

export interface QuizQuestion {
  id: string
  type: 'mcq' | 'true-false' | 'short-answer' | 'fill-blank'
  question: string
  options?: string[]
  answer: string
  explanation: string
  citation: Citation
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  timesSeen: number
  timesCorrect: number
}

export interface QuizSettings {
  timeLimit?: number
  shuffleQuestions: boolean
  shuffleOptions: boolean
  showExplanations: boolean
  adaptiveDifficulty: boolean
  passingScore: number
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  answers: Record<string, string>
  score: number
  totalQuestions: number
  correct: number
  timeSpent: number
  completedAt: string
  feedback: string
}

// ─── Flashcards ───────────────────────────────────────────────────────────────

export interface FlashcardDeck {
  id: string
  materialId: string
  userId: string
  title: string
  subject: string
  cards: Flashcard[]
  studyStats: StudyStats
  nextReview: string
  createdAt: string
  tags: string[]
}

export interface Flashcard {
  id: string
  front: string
  back: string
  hint?: string
  citation: Citation
  difficulty: number // 1-5, spaced repetition factor
  nextReview: string
  reviewCount: number
  lastResult?: 'again' | 'hard' | 'good' | 'easy'
  topic: string
}

export interface StudyStats {
  totalCards: number
  mastered: number
  learning: number
  new: number
  streak: number
}

// ─── AI Tutor ─────────────────────────────────────────────────────────────────

export interface ChatSession {
  id: string
  userId: string
  materialId?: string
  title: string
  messages: ChatMessage[]
  model: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  citations?: Citation[]
  timestamp: string
  tokens?: number
  isError?: boolean
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface LearningAnalytics {
  userId: string
  period: 'day' | 'week' | 'month' | 'year'
  studyTime: TimeSeriesPoint[]
  quizScores: TimeSeriesPoint[]
  materialsStudied: number
  notesCreated: number
  flashcardsReviewed: number
  quizzesTaken: number
  averageScore: number
  streak: number
  topSubjects: SubjectStat[]
  weakAreas: string[]
  strengths: string[]
  learningVelocity: number
}

export interface TimeSeriesPoint {
  date: string
  value: number
}

export interface SubjectStat {
  subject: string
  score: number
  time: number
  materials: number
}

// ─── Collaboration ────────────────────────────────────────────────────────────

export interface Workspace {
  id: string
  name: string
  description: string
  members: WorkspaceMember[]
  materials: string[]
  notes: string[]
  discussions: Discussion[]
  createdAt: string
  ownerId: string
  isPublic: boolean
  inviteCode: string
}

export interface WorkspaceMember {
  userId: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'editor' | 'viewer'
  joinedAt: string
  lastActive: string
}

export interface Discussion {
  id: string
  workspaceId: string
  authorId: string
  authorName: string
  content: string
  replies: DiscussionReply[]
  noteId?: string
  createdAt: string
  isResolved: boolean
}

export interface DiscussionReply {
  id: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  href: string
  label: string
  icon: string
  badge?: number
  subItems?: NavItem[]
}
