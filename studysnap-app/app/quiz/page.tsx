'use client'
import React, { useState, useEffect } from 'react'
import { Brain, Clock, CheckCircle, X, ChevronRight, RotateCcw, TrendingUp, BookOpen, AlertCircle } from 'lucide-react'
import TopBar from '@/components/TopBar'
import { MOCK_QUIZZES } from '@/lib/data'
import { calculateScore, getGradeLabel, formatDuration } from '@/lib/utils'
import type { QuizQuestion } from '@/types'

type QuizState = 'list' | 'quiz' | 'result'

export default function QuizPage() {
  const quizzes = MOCK_QUIZZES
  const [state, setState] = useState<QuizState>('list')
  const [activeQuiz, setActiveQuiz] = useState(quizzes[0])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (state !== 'quiz') return
    const t = setInterval(() => setTimeSpent(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [state])

  const questions = activeQuiz?.questions || []
  const question = questions[currentQ] as QuizQuestion | undefined
  const selected = question ? answers[question.id] : undefined
  const isCorrect = selected === question?.answer
  const score = calculateScore(
    Object.entries(answers).filter(([qid, ans]) => questions.find(q => q.id === qid)?.answer === ans).length,
    questions.length
  )

  const handleAnswer = (opt: string) => {
    if (revealed) return
    setAnswers(prev => ({ ...prev, [question!.id]: opt }))
    setRevealed(true)
  }

  const nextQuestion = () => {
    setRevealed(false)
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1)
    } else {
      setState('result')
    }
  }

  const restart = () => {
    setCurrentQ(0)
    setAnswers({})
    setRevealed(false)
    setTimeSpent(0)
    setState('quiz')
  }

  if (state === 'result') {
    const grade = getGradeLabel(score)
    const correct = Object.entries(answers).filter(([qid, ans]) => questions.find(q => q.id === qid)?.answer === ans).length
    return (
      <div style={{ animation: 'fadeIn 0.35s ease' }}>
        <TopBar title="Quiz Results" />
        <div style={{ padding: '2rem', maxWidth: 680, margin: '0 auto' }}>
          <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}</div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: grade.color, marginBottom: '0.35rem' }}>{score}%</div>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.35rem', color: grade.color }}>{grade.label}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
              {correct} of {questions.length} correct · {formatDuration(timeSpent)} time
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={restart} className="btn btn-primary"><RotateCcw size={15} /> Retake Quiz</button>
              <button onClick={() => setState('list')} className="btn btn-secondary">All Quizzes</button>
            </div>
          </div>

          {/* Feedback */}
          {score < 80 && (
            <div style={{ padding: '1rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <AlertCircle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem', color: '#fbbf24' }}>Study Recommendation</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                  Review the questions you missed — the AI has linked each explanation back to your source material.
                </div>
              </div>
            </div>
          )}

          {/* Per-question review */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {questions.map((q, i) => {
              const userAns = answers[q.id]
              const correct = userAns === q.answer
              return (
                <div key={q.id} style={{ padding: '1rem', borderRadius: 12, border: `1px solid ${correct ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`, background: correct ? 'rgba(16,185,129,0.05)' : 'rgba(244,63,94,0.05)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    {correct ? <CheckCircle size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} /> : <X size={15} color="#f43f5e" style={{ flexShrink: 0, marginTop: 2 }} />}
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Q{i + 1}: {q.question}</div>
                      {!correct && <div style={{ fontSize: '0.8rem', color: '#34d399' }}>✓ Correct: {q.answer}</div>}
                      {userAns && !correct && <div style={{ fontSize: '0.8rem', color: '#fb7185' }}>✗ Your answer: {userAns}</div>}
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{q.explanation}</div>
                      <span className="citation" style={{ marginTop: '0.35rem', display: 'inline-flex' }}>[p.{q.citation.page}] {q.citation.source}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (state === 'quiz' && question) {
    const progress = ((currentQ) / questions.length) * 100
    return (
      <div style={{ animation: 'fadeIn 0.35s ease' }}>
        <TopBar title={activeQuiz.title} subtitle={`Question ${currentQ + 1} of ${questions.length}`} />
        <div style={{ padding: '2rem', maxWidth: 680, margin: '0 auto' }}>
          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0 }}>
              <Clock size={13} /> {formatDuration(timeSpent)}
            </div>
          </div>

          {/* Question card */}
          <div className="card" style={{ marginBottom: '1.25rem', padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="badge badge-blue">{question.topic}</span>
              <span className={`badge ${question.difficulty === 'easy' ? 'badge-green' : question.difficulty === 'medium' ? 'badge-amber' : 'badge-rose'}`}>{question.difficulty}</span>
              <span className="badge badge-purple">{question.type.toUpperCase()}</span>
            </div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.5, marginBottom: '1.5rem' }}>{question.question}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {(question.options || []).map((opt, i) => {
                let cls = 'quiz-option'
                if (revealed) {
                  if (opt === question.answer) cls += ' correct'
                  else if (opt === selected) cls += ' incorrect'
                } else if (opt === selected) cls += ' selected'
                const letter = String.fromCharCode(65 + i)
                return (
                  <div key={opt} className={cls} onClick={() => handleAnswer(opt)}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', background: 'var(--bg-card)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, border: '1px solid var(--border)',
                    }}>{letter}</div>
                    <span style={{ fontSize: '0.875rem' }}>{opt}</span>
                    {revealed && opt === question.answer && <CheckCircle size={16} color="#10b981" style={{ marginLeft: 'auto' }} />}
                    {revealed && opt === selected && opt !== question.answer && <X size={16} color="#f43f5e" style={{ marginLeft: 'auto' }} />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Explanation */}
          {revealed && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ padding: '1rem', background: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)', border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`, borderRadius: 12, marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem', color: isCorrect ? '#34d399' : '#fb7185' }}>
                  {isCorrect ? '✓ Correct!' : '✗ Not quite.'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{question.explanation}</div>
                <div style={{ marginTop: '0.5rem' }}>
                  <span className="citation"><BookOpen size={10} /> [{question.citation.source}, p.{question.citation.page}] · {Math.round(question.citation.confidence * 100)}% confidence</span>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={nextQuestion}>
                {currentQ < questions.length - 1 ? <>Next Question <ChevronRight size={15} /></> : <>View Results <TrendingUp size={15} /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Quiz list
  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      <TopBar title="Quizzes" subtitle="Adaptive quizzes generated from your study materials" />
      <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {quizzes.map(quiz => {
            const lastAttempt = quiz.attempts[quiz.attempts.length - 1]
            const grade = lastAttempt ? getGradeLabel(lastAttempt.score) : null
            return (
              <div key={quiz.id} className="card">
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-purple">{quiz.subject}</span>
                  <span className={`badge ${quiz.difficulty === 'easy' ? 'badge-green' : quiz.difficulty === 'medium' ? 'badge-amber' : quiz.difficulty === 'hard' ? 'badge-rose' : 'badge-cyan'}`}>{quiz.difficulty}</span>
                  {quiz.settings.adaptiveDifficulty && <span className="badge badge-blue">Adaptive</span>}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>{quiz.title}</h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  {quiz.questions.length} questions · {quiz.attempts.length} attempt{quiz.attempts.length !== 1 ? 's' : ''}
                </div>
                {lastAttempt && grade && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem', fontSize: '0.83rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Last score</span>
                    <span style={{ fontWeight: 700, color: grade.color }}>{lastAttempt.score}% — {grade.label}</span>
                  </div>
                )}
                {lastAttempt && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${lastAttempt.score}%` }} />
                    </div>
                  </div>
                )}
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => { setActiveQuiz(quiz); setCurrentQ(0); setAnswers({}); setTimeSpent(0); setState('quiz') }}
                >
                  <Brain size={14} /> {lastAttempt ? 'Retake Quiz' : 'Start Quiz'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
