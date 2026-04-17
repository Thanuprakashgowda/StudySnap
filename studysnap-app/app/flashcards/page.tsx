'use client'
import React, { useState } from 'react'
import { Zap, RotateCcw, ChevronLeft, ChevronRight, Flame, CheckCircle, AlertCircle, Clock, BookOpen } from 'lucide-react'
import TopBar from '@/components/TopBar'
import { MOCK_FLASHCARD_DECKS } from '@/lib/data'
import type { Flashcard } from '@/types'

type Rating = 'again' | 'hard' | 'good' | 'easy'

const RATING_CONFIG: Record<Rating, { label: string; color: string; bg: string; desc: string }> = {
  again: { label: 'Again', color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', desc: 'Review again soon' },
  hard: { label: 'Hard', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', desc: 'More practice needed' },
  good: { label: 'Good', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', desc: 'On track' },
  easy: { label: 'Easy', color: '#10b981', bg: 'rgba(16,185,129,0.1)', desc: 'Well mastered' },
}

export default function FlashcardsPage() {
  const decks = MOCK_FLASHCARD_DECKS
  const [activeDeck, setActiveDeck] = useState<typeof decks[0] | null>(null)
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [ratings, setRatings] = useState<Record<string, Rating>>({})
  const [done, setDone] = useState(false)

  const cards = activeDeck?.cards || []
  const card = cards[cardIndex] as Flashcard | undefined
  const progress = cards.length ? (cardIndex / cards.length) * 100 : 0

  const startDeck = (deck: typeof decks[0]) => {
    setActiveDeck(deck)
    setCardIndex(0)
    setFlipped(false)
    setRatings({})
    setDone(false)
  }

  const rate = (r: Rating) => {
    if (!card) return
    setRatings(prev => ({ ...prev, [card.id]: r }))
    setFlipped(false)
    if (cardIndex < cards.length - 1) {
      setTimeout(() => setCardIndex(i => i + 1), 250)
    } else {
      setDone(true)
    }
  }

  const masteredCount = Object.values(ratings).filter(r => r === 'easy').length
  const learningCount = Object.values(ratings).filter(r => r === 'good').length
  const needsReviewCount = Object.values(ratings).filter(r => r === 'again' || r === 'hard').length

  if (done && activeDeck) {
    return (
      <div style={{ animation: 'fadeIn 0.35s ease' }}>
        <TopBar title="Session Complete!" />
        <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div className="card" style={{ padding: '3rem 2rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Session Complete!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              You reviewed all {cards.length} cards in <strong>{activeDeck.title}</strong>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Easy', count: masteredCount, color: '#10b981' },
                { label: 'Learning', count: learningCount, color: '#3b82f6' },
                { label: 'Review', count: needsReviewCount, color: '#f43f5e' },
              ].map(({ label, count, color }) => (
                <div key={label} style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color }}>{count}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => startDeck(activeDeck)} className="btn btn-primary"><RotateCcw size={14} /> Study Again</button>
              <button onClick={() => setActiveDeck(null)} className="btn btn-secondary">All Decks</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (activeDeck && card) {
    return (
      <div style={{ animation: 'fadeIn 0.35s ease' }}>
        <TopBar
          title={activeDeck.title}
          subtitle={`Card ${cardIndex + 1} of ${cards.length}`}
          actions={
            <button onClick={() => setActiveDeck(null)} className="btn btn-ghost btn-sm"><ChevronLeft size={14} /> Decks</button>
          }
        />
        <div style={{ padding: '2rem', maxWidth: 680, margin: '0 auto' }}>
          {/* Progress */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div className="progress-fill" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #10b981, #3b82f6)' }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0 }}>{cardIndex + 1}/{cards.length}</span>
          </div>

          {/* Topic badge */}
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge-purple">{card.topic}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={11} /> Reviewed {card.reviewCount}x
            </span>
          </div>

          {/* Flashcard */}
          <div className="flashcard-container" style={{ marginBottom: '1.5rem' }}>
            <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
              {/* Front */}
              <div className="flashcard-front">
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>Question</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.5, color: 'var(--text-primary)', marginBottom: '1rem' }}>{card.front}</div>
                {card.hint && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                    💡 Hint: {card.hint}
                  </div>
                )}
                <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click to reveal answer</div>
              </div>
              {/* Back */}
              <div className="flashcard-back">
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-purple-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>Answer</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '1rem' }}>{card.back}</div>
                <span className="citation" style={{ marginTop: '0.5rem' }}>
                  <BookOpen size={10} /> {card.citation.source}, p.{card.citation.page}
                </span>
              </div>
            </div>
          </div>

          {/* Rating buttons (shown after flip) */}
          {flipped && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>How well did you know this?</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem' }}>
                {(Object.entries(RATING_CONFIG) as [Rating, typeof RATING_CONFIG[Rating]][]).map(([key, cfg]) => (
                  <button key={key} onClick={() => rate(key)}
                    style={{ padding: '0.65rem 0.5rem', borderRadius: 10, border: `1px solid ${cfg.color}44`, background: cfg.bg, color: cfg.color, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', fontWeight: 600, fontSize: '0.85rem' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = cfg.color; (e.currentTarget as HTMLElement).style.color = 'white' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = cfg.bg; (e.currentTarget as HTMLElement).style.color = cfg.color }}>
                    {cfg.label}
                    <span style={{ fontSize: '0.67rem', fontWeight: 400, opacity: 0.8 }}>{cfg.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!flipped && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button onClick={() => { setFlipped(false); setCardIndex(i => Math.max(0, i - 1)) }} className="btn btn-ghost" disabled={cardIndex === 0}>
                <ChevronLeft size={15} /> Prev
              </button>
              <button onClick={() => setFlipped(true)} className="btn btn-primary">Reveal Answer</button>
              <button onClick={() => { setFlipped(false); setCardIndex(i => Math.min(cards.length - 1, i + 1)) }} className="btn btn-ghost" disabled={cardIndex === cards.length - 1}>
                Skip <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Deck list
  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      <TopBar title="Flashcards" subtitle="Spaced repetition system for maximum retention" />
      <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {decks.map(deck => {
            const progress = (deck.studyStats.mastered / deck.studyStats.totalCards) * 100
            return (
              <div key={deck.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-purple">{deck.subject}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600 }}>
                    <Flame size={13} /> {deck.studyStats.streak}d streak
                  </div>
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>{deck.title}</h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  {deck.studyStats.totalCards} cards · due review today
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    <span>Mastery</span><span>{Math.round(progress)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #10b981, #3b82f6)' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                  {[
                    { label: 'New', count: deck.studyStats.new, color: '#3b82f6' },
                    { label: 'Learning', count: deck.studyStats.learning, color: '#f59e0b' },
                    { label: 'Mastered', count: deck.studyStats.mastered, color: '#10b981' },
                  ].map(({ label, count, color }) => (
                    <div key={label} style={{ textAlign: 'center', padding: '0.4rem', background: 'var(--bg-input)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 700, color, fontSize: '1rem' }}>{count}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{label}</div>
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => startDeck(deck)}>
                  <Zap size={14} /> Start Review Session
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
