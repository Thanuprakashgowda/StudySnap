import type {
  User, StudyMaterial, Note, Quiz, FlashcardDeck,
  ChatSession, LearningAnalytics, Workspace
} from '@/types'

// ─── Mock User ────────────────────────────────────────────────────────────────
export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@university.edu',
  role: 'student',
  plan: 'pro',
  language: 'en',
  createdAt: '2025-09-01T00:00:00Z',
  settings: {
    theme: 'dark',
    language: 'en',
    notifications: true,
    emailDigest: true,
    autoTranscribe: true,
    defaultSubject: 'Biology',
    exportFormat: 'pdf',
    accessibility: { highContrast: false, fontSize: 'md', reduceMotion: false },
  },
}

// ─── Mock Materials ───────────────────────────────────────────────────────────
export const MOCK_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-1',
    userId: 'user-1',
    title: 'Introduction to Molecular Biology',
    subject: 'Biology',
    description: 'Comprehensive lecture covering DNA replication, transcription, and translation.',
    fileType: 'pdf',
    fileSize: 4500000,
    fileUrl: '/files/mol-bio.pdf',
    transcription: 'DNA replication is a fundamental process in which a DNA molecule is copied to produce two identical DNA molecules...',
    language: 'en',
    tags: ['DNA', 'genetics', 'cell biology'],
    status: 'ready',
    sharedWith: [],
    isPublic: false,
    createdAt: '2026-04-10T09:00:00Z',
    updatedAt: '2026-04-10T09:15:00Z',
    metadata: { pageCount: 42, wordCount: 12400 },
  },
  {
    id: 'mat-2',
    userId: 'user-1',
    title: 'Quantum Mechanics — Wave Functions',
    subject: 'Physics',
    description: 'Video lecture on Schrödinger equation and quantum superposition.',
    fileType: 'video',
    fileSize: 240000000,
    fileUrl: '/files/quantum.mp4',
    language: 'en',
    tags: ['quantum', 'waves', 'Schrödinger'],
    status: 'ready',
    sharedWith: [],
    isPublic: false,
    createdAt: '2026-04-08T14:00:00Z',
    updatedAt: '2026-04-08T14:45:00Z',
    metadata: { duration: 2700, wordCount: 8800 },
  },
  {
    id: 'mat-3',
    userId: 'user-1',
    title: 'Macroeconomics — Fiscal Policy',
    subject: 'Economics',
    description: 'Recorded seminar on government spending, taxation, and economic stabilization.',
    fileType: 'audio',
    fileSize: 48000000,
    fileUrl: '/files/macro-econ.mp3',
    language: 'en',
    tags: ['fiscal', 'government', 'GDP'],
    status: 'processing',
    processingProgress: 68,
    sharedWith: ['user-2'],
    isPublic: false,
    createdAt: '2026-04-16T11:00:00Z',
    updatedAt: '2026-04-16T11:30:00Z',
    metadata: { duration: 3600 },
  },
  {
    id: 'mat-4',
    userId: 'user-1',
    title: 'World War II — Causes and Consequences',
    subject: 'History',
    description: 'Chapter summary and analysis of WWII origins and global impact.',
    fileType: 'pdf',
    fileSize: 2100000,
    fileUrl: '/files/wwii.pdf',
    language: 'en',
    tags: ['WWII', 'Europe', 'Cold War origins'],
    status: 'ready',
    sharedWith: [],
    isPublic: true,
    createdAt: '2026-04-05T16:00:00Z',
    updatedAt: '2026-04-05T16:10:00Z',
    metadata: { pageCount: 28, wordCount: 7200 },
  },
]

// ─── Mock Notes ───────────────────────────────────────────────────────────────
export const MOCK_NOTES: Note[] = [
  {
    id: 'note-1',
    materialId: 'mat-1',
    userId: 'user-1',
    title: 'Molecular Biology — Key Concepts',
    content: `# Introduction to Molecular Biology

## DNA Replication

DNA replication is a **semi-conservative** process, meaning each new DNA molecule consists of one original (template) strand and one newly synthesized strand. <span class="citation">[Source, p.3]</span>

### Key Enzymes Involved
- **Helicase** — Unwinds the double helix by breaking hydrogen bonds
- **Primase** — Synthesizes short RNA primers
- **DNA Polymerase III** — Adds nucleotides in the 5' → 3' direction
- **Ligase** — Joins Okazaki fragments on the lagging strand

### Leading vs. Lagging Strand
The **leading strand** is synthesized continuously, while the **lagging strand** is synthesized in fragments (Okazaki fragments) due to the antiparallel nature of DNA. <span class="citation">[Source, p.7]</span>

## Transcription

Transcription converts DNA information into mRNA. RNA Polymerase binds to the promoter region and moves along the template strand from 3' to 5', synthesizing mRNA from 5' to 3'. <span class="citation">[Source, p.14]</span>

### Three Stages:
1. **Initiation** — RNA Pol binds to promoter (TATA box)
2. **Elongation** — RNA Pol reads template, adds complementary ribonucleotides
3. **Termination** — Release at terminator sequence

## Translation

The **ribosome** reads mRNA codons (triplets) and recruits tRNA carrying amino acids to build a polypeptide chain. <span class="citation">[Source, p.21]</span>

### Genetic Code Properties
- Universal — same across most organisms
- Redundant (degenerate) — multiple codons code for the same amino acid
- Unambiguous — each codon codes for only one amino acid`,
    summary: 'Core molecular biology processes: DNA replication (semi-conservative), transcription (DNA→mRNA), and translation (mRNA→protein), including key enzymes and stages.',
    keyPoints: [
      'DNA replication is semi-conservative',
      'Helicase, Primase, DNA Pol III, Ligase are key enzymes',
      'Leading strand is continuous; lagging strand is fragmented (Okazaki)',
      'Transcription requires RNA Polymerase and has 3 stages',
      'Genetic code is universal, redundant, and unambiguous',
    ],
    citations: [
      { id: 'c1', text: 'Semi-conservative replication demonstrated by Meselson & Stahl', source: 'Introduction to Molecular Biology', page: 3, confidence: 0.97 },
      { id: 'c2', text: 'Okazaki fragments on the lagging strand', source: 'Introduction to Molecular Biology', page: 7, confidence: 0.94 },
    ],
    tags: ['DNA', 'replication', 'transcription', 'translation'],
    language: 'en',
    isEdited: false,
    isFavorite: true,
    collaborators: [],
    createdAt: '2026-04-10T10:00:00Z',
    updatedAt: '2026-04-10T10:05:00Z',
    version: 1,
    history: [],
  },
]

// ─── Mock Quiz ────────────────────────────────────────────────────────────────
export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    materialId: 'mat-1',
    userId: 'user-1',
    title: 'Molecular Biology Quiz',
    subject: 'Biology',
    difficulty: 'adaptive',
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: 'Which enzyme is responsible for unwinding the DNA double helix during replication?',
        options: ['DNA Polymerase', 'Helicase', 'Ligase', 'Primase'],
        answer: 'Helicase',
        explanation: 'Helicase unwinds the double helix by breaking the hydrogen bonds between complementary base pairs, creating the replication fork.',
        citation: { id: 'c1', text: 'Helicase unwinds the double helix', source: 'Mol Bio Lecture', page: 5, confidence: 0.98 },
        difficulty: 'easy',
        topic: 'DNA Replication',
        timesSeen: 3,
        timesCorrect: 2,
      },
      {
        id: 'q2',
        type: 'mcq',
        question: 'What is the direction of DNA synthesis by DNA Polymerase?',
        options: ["3' to 5'", "5' to 3'", 'Either direction', 'Bidirectional simultaneously'],
        answer: "5' to 3'",
        explanation: "DNA Polymerase can only add nucleotides to the 3' end of the growing chain, so synthesis always proceeds 5' to 3'.",
        citation: { id: 'c2', text: 'DNA Pol adds nucleotides 5\' to 3\'', source: 'Mol Bio Lecture', page: 6, confidence: 0.99 },
        difficulty: 'medium',
        topic: 'DNA Replication',
        timesSeen: 2,
        timesCorrect: 1,
      },
      {
        id: 'q3',
        type: 'true-false',
        question: 'The genetic code is universal — the same codons code for the same amino acids across virtually all organisms.',
        options: ['True', 'False'],
        answer: 'True',
        explanation: 'The genetic code is indeed universal with only minor exceptions in mitochondria and some protists, supporting the idea of a common ancestor.',
        citation: { id: 'c3', text: 'Genetic code universality', source: 'Mol Bio Lecture', page: 22, confidence: 0.96 },
        difficulty: 'easy',
        topic: 'Translation',
        timesSeen: 1,
        timesCorrect: 1,
      },
      {
        id: 'q4',
        type: 'mcq',
        question: 'What are Okazaki fragments?',
        options: [
          'Fragments of mRNA produced during transcription',
          'Short DNA sequences synthesized on the lagging strand',
          'Broken pieces of the histone complex',
          'RNA primers used to start replication',
        ],
        answer: 'Short DNA sequences synthesized on the lagging strand',
        explanation: 'Because DNA Pol can only work 5\' to 3\', the lagging strand must be synthesized in short segments called Okazaki fragments, which are later joined by Ligase.',
        citation: { id: 'c4', text: 'Okazaki fragments on lagging strand', source: 'Mol Bio Lecture', page: 7, confidence: 0.97 },
        difficulty: 'medium',
        topic: 'DNA Replication',
        timesSeen: 2,
        timesCorrect: 0,
      },
      {
        id: 'q5',
        type: 'mcq',
        question: 'Which component of the transcription machinery recognizes and binds to the promoter region?',
        options: ['tRNA', 'Ribosome', 'RNA Polymerase', 'Spliceosome'],
        answer: 'RNA Polymerase',
        explanation: 'RNA Polymerase recognizes and binds to the promoter (including the TATA box) to initiate transcription.',
        citation: { id: 'c5', text: 'RNA Pol binds promoter to initiate', source: 'Mol Bio Lecture', page: 14, confidence: 0.98 },
        difficulty: 'easy',
        topic: 'Transcription',
        timesSeen: 4,
        timesCorrect: 3,
      },
    ],
    settings: {
      shuffleQuestions: true,
      shuffleOptions: true,
      showExplanations: true,
      adaptiveDifficulty: true,
      passingScore: 70,
    },
    attempts: [
      { id: 'att-1', quizId: 'quiz-1', userId: 'user-1', answers: {}, score: 80, totalQuestions: 5, correct: 4, timeSpent: 420, completedAt: '2026-04-11T09:00:00Z', feedback: 'Great work! Review Okazaki fragments.' },
      { id: 'att-2', quizId: 'quiz-1', userId: 'user-1', answers: {}, score: 60, totalQuestions: 5, correct: 3, timeSpent: 510, completedAt: '2026-04-12T09:00:00Z', feedback: 'Keep practicing DNA replication steps.' },
    ],
    createdAt: '2026-04-10T11:00:00Z',
    tags: ['DNA', 'replication', 'transcription'],
  },
]

// ─── Mock Flashcards ──────────────────────────────────────────────────────────
export const MOCK_FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-1',
    materialId: 'mat-1',
    userId: 'user-1',
    title: 'Molecular Biology Terms',
    subject: 'Biology',
    cards: [
      {
        id: 'fc-1', front: 'What is helicase?', back: 'An enzyme that unwinds the DNA double helix by breaking hydrogen bonds between base pairs during replication.',
        hint: 'Think of it as a "zipper unzipper"', citation: { id: 'c1', text: 'Helicase unwinds', source: 'Mol Bio', page: 5, confidence: 0.98 },
        difficulty: 2, nextReview: '2026-04-18T00:00:00Z', reviewCount: 3, lastResult: 'good', topic: 'Enzymes',
      },
      {
        id: 'fc-2', front: 'Define semi-conservative replication', back: 'Each daughter DNA molecule retains one original (parental) strand and one newly synthesized strand.',
        hint: 'Half old, half new', citation: { id: 'c2', text: 'Semi-conservative', source: 'Mol Bio', page: 3, confidence: 0.97 },
        difficulty: 3, nextReview: '2026-04-19T00:00:00Z', reviewCount: 2, lastResult: 'hard', topic: 'DNA Replication',
      },
      {
        id: 'fc-3', front: 'What is the TATA box?', back: 'A DNA sequence (TATAAA) in eukaryotic gene promoters that serves as a binding site for transcription factors and RNA Polymerase.',
        hint: 'Promoter element', citation: { id: 'c3', text: 'TATA box promoter', source: 'Mol Bio', page: 15, confidence: 0.95 },
        difficulty: 4, nextReview: '2026-04-17T00:00:00Z', reviewCount: 1, lastResult: 'again', topic: 'Transcription',
      },
      {
        id: 'fc-4', front: 'What are codons?', back: 'Three-nucleotide sequences in mRNA that specify a particular amino acid or a stop signal during translation.',
        hint: 'Triplets of nucleotides', citation: { id: 'c4', text: 'Codons — triplets', source: 'Mol Bio', page: 21, confidence: 0.99 },
        difficulty: 1, nextReview: '2026-04-25T00:00:00Z', reviewCount: 5, lastResult: 'easy', topic: 'Translation',
      },
      {
        id: 'fc-5', front: 'What is an Okazaki fragment?', back: 'Short segments of DNA synthesized on the lagging strand during replication, later joined by DNA Ligase.',
        hint: 'Lagging strand fragments', citation: { id: 'c5', text: 'Okazaki fragments', source: 'Mol Bio', page: 7, confidence: 0.97 },
        difficulty: 3, nextReview: '2026-04-18T00:00:00Z', reviewCount: 2, lastResult: 'hard', topic: 'DNA Replication',
      },
    ],
    studyStats: { totalCards: 5, mastered: 1, learning: 3, new: 1, streak: 4 },
    nextReview: '2026-04-17T08:00:00Z',
    createdAt: '2026-04-10T12:00:00Z',
    tags: ['DNA', 'enzymes', 'molecular'],
  },
]

// ─── Mock Analytics ───────────────────────────────────────────────────────────
export const MOCK_ANALYTICS: LearningAnalytics = {
  userId: 'user-1',
  period: 'week',
  studyTime: [
    { date: '2026-04-11', value: 45 },
    { date: '2026-04-12', value: 30 },
    { date: '2026-04-13', value: 90 },
    { date: '2026-04-14', value: 60 },
    { date: '2026-04-15', value: 120 },
    { date: '2026-04-16', value: 75 },
    { date: '2026-04-17', value: 50 },
  ],
  quizScores: [
    { date: '2026-04-11', value: 72 },
    { date: '2026-04-12', value: 65 },
    { date: '2026-04-13', value: 80 },
    { date: '2026-04-14', value: 75 },
    { date: '2026-04-15', value: 88 },
    { date: '2026-04-16', value: 82 },
    { date: '2026-04-17', value: 91 },
  ],
  materialsStudied: 4,
  notesCreated: 7,
  flashcardsReviewed: 42,
  quizzesTaken: 6,
  averageScore: 79,
  streak: 7,
  topSubjects: [
    { subject: 'Biology', score: 85, time: 180, materials: 2 },
    { subject: 'Physics', score: 72, time: 120, materials: 1 },
    { subject: 'History', score: 91, time: 90, materials: 1 },
    { subject: 'Economics', score: 68, time: 60, materials: 1 },
  ],
  weakAreas: ['Lagging strand synthesis', 'Quantum wave function collapse', 'Keynesian multiplier'],
  strengths: ['DNA transcription', 'WWII chronology', 'Fiscal policy basics'],
  learningVelocity: 1.14,
}

// ─── Mock Chat ────────────────────────────────────────────────────────────────
export const MOCK_CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'chat-1',
    userId: 'user-1',
    materialId: 'mat-1',
    title: 'Molecular Biology Q&A',
    model: 'gemini-1.5-pro',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Can you explain why DNA replication is called semi-conservative?',
        timestamp: '2026-04-10T15:00:00Z',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Great question! DNA replication is called **semi-conservative** because each resulting DNA molecule keeps ("conserves") one of the original parent strands while the other strand is newly synthesized.\n\nThink of it this way:\n- The original double helix unwinds\n- Each strand serves as a **template**\n- A new complementary strand is built on each template\n- Result: **2 daughter molecules**, each with 1 old + 1 new strand\n\nThis was elegantly proven by **Meselson and Stahl (1958)** using nitrogen isotope labeling.',
        citations: [
          { id: 'c1', text: 'Semi-conservative replication proved by Meselson & Stahl', source: 'Introduction to Molecular Biology', page: 3, confidence: 0.97 },
        ],
        timestamp: '2026-04-10T15:00:05Z',
        tokens: 142,
      },
      {
        id: 'msg-3',
        role: 'user',
        content: 'What happens if DNA Polymerase makes a mistake?',
        timestamp: '2026-04-10T15:01:00Z',
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: 'DNA Polymerase has a built-in **proofreading** mechanism! Here\'s what happens:\n\n1. **3\' to 5\' exonuclease activity** — Pol III can remove incorrectly incorporated nucleotides immediately\n2. **Mismatch Repair (MMR)** — Post-replication system scans for base-pair mismatches and fixes them\n3. **Nucleotide Excision Repair** — Removes bulky lesions (e.g., UV-induced thymine dimers)\n\nThe overall error rate after proofreading is approximately **1 mistake per 10⁹ base pairs** — incredibly accurate!\n\nIf errors persist, they can lead to **point mutations**, which may be harmless, beneficial, or contribute to diseases like cancer.',
        citations: [
          { id: 'c2', text: 'Proofreading by 3\' exonuclease activity', source: 'Introduction to Molecular Biology', page: 9, confidence: 0.95 },
        ],
        timestamp: '2026-04-10T15:01:08Z',
        tokens: 189,
      },
    ],
    createdAt: '2026-04-10T15:00:00Z',
    updatedAt: '2026-04-10T15:01:08Z',
  },
]

// ─── Mock Workspace ───────────────────────────────────────────────────────────
export const MOCK_WORKSPACE: Workspace = {
  id: 'ws-1',
  name: 'BIO 301 Study Group',
  description: 'Collaborative study space for Molecular Biology final exam prep',
  ownerId: 'user-1',
  members: [
    { userId: 'user-1', name: 'Alex Johnson', email: 'alex@uni.edu', role: 'owner', joinedAt: '2026-03-01T00:00:00Z', lastActive: '2026-04-17T10:00:00Z' },
    { userId: 'user-2', name: 'Priya Sharma', email: 'priya@uni.edu', role: 'editor', joinedAt: '2026-03-05T00:00:00Z', lastActive: '2026-04-16T22:00:00Z' },
    { userId: 'user-3', name: 'Carlos Mendez', email: 'carlos@uni.edu', role: 'editor', joinedAt: '2026-03-08T00:00:00Z', lastActive: '2026-04-17T09:30:00Z' },
    { userId: 'user-4', name: 'Jung-ah Kim', email: 'jungah@uni.edu', role: 'viewer', joinedAt: '2026-03-15T00:00:00Z', lastActive: '2026-04-15T18:00:00Z' },
  ],
  materials: ['mat-1', 'mat-2'],
  notes: ['note-1'],
  discussions: [
    {
      id: 'disc-1',
      workspaceId: 'ws-1',
      authorId: 'user-2',
      authorName: 'Priya Sharma',
      content: 'Hey everyone! Can someone clarify the difference between leading and lagging strand synthesis? The Okazaki fragment part is confusing me.',
      replies: [
        { id: 'rep-1', authorId: 'user-1', authorName: 'Alex Johnson', content: 'Sure! The leading strand is synthesized continuously in the same direction as the replication fork moves. The lagging strand goes the "wrong" way relative to fork movement, so it needs short Okazaki fragments. Check note-1 for a full breakdown!', createdAt: '2026-04-15T20:00:00Z' },
        { id: 'rep-2', authorId: 'user-3', authorName: 'Carlos Mendez', content: 'Also watch the Molecular Biology video (mat-2) around the 32-minute mark — the animation makes it super clear!', createdAt: '2026-04-15T20:15:00Z' },
      ],
      noteId: 'note-1',
      createdAt: '2026-04-15T19:45:00Z',
      isResolved: true,
    },
    {
      id: 'disc-2',
      workspaceId: 'ws-1',
      authorId: 'user-3',
      authorName: 'Carlos Mendez',
      content: 'Should we focus on memorizing all restriction enzyme cut sites or just the common ones (EcoRI, HindIII, BamHI)?',
      replies: [],
      createdAt: '2026-04-16T14:00:00Z',
      isResolved: false,
    },
  ],
  isPublic: false,
  inviteCode: 'BIO301-XK92P',
  createdAt: '2026-03-01T00:00:00Z',
}
