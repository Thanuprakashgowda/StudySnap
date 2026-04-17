import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/lib/context'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'StudySnap+ | AI-Powered Learning Platform',
  description: 'Transform lectures, PDFs, and videos into smart notes, adaptive quizzes, and personalized study sessions powered by AI.',
  keywords: 'AI learning, study notes, flashcards, quiz generator, AI tutor, education technology',
  openGraph: {
    title: 'StudySnap+ — Next-Gen AI Learning',
    description: 'Upload any lecture. Get smart notes, quizzes, and an AI tutor — instantly.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0f0f1a" />
      </head>
      <body className={inter.variable} style={{ fontFamily: "'Inter', 'Outfit', system-ui, sans-serif" }}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
