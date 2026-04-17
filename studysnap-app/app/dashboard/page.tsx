'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import {
  Upload, FileText, Brain, Zap, MessageSquare, BarChart3,
  TrendingUp, Clock, Flame, Star, ChevronRight, BookOpen,
  Plus, Play, Users, ArrowUpRight
} from 'lucide-react'
import TopBar from '@/components/TopBar'
import { MOCK_MATERIALS, MOCK_QUIZZES, MOCK_FLASHCARD_DECKS, MOCK_ANALYTICS, MOCK_USER } from '@/lib/data'
import { formatRelativeTime, formatFileSize, calculateScore, getGradeLabel } from '@/lib/utils'

const QUICK_ACTIONS = [
  { href: '/upload', label: 'Upload Material', icon: Upload, color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' },
  { href: '/notes', label: 'View Notes', icon: FileText, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  { href: '/quiz', label: 'Take Quiz', icon: Brain, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  { href: '/tutor', label: 'Ask AI Tutor', icon: MessageSquare, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { href: '/flashcards', label: 'Review Cards', icon: Zap, color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  { href: '/analytics', label: 'My Progress', icon: BarChart3, color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
]

export default function DashboardPage() {
  const user = MOCK_USER
  const analytics = MOCK_ANALYTICS
  const materials = MOCK_MATERIALS
  const quizzes = MOCK_QUIZZES
  const decks = MOCK_FLASHCARD_DECKS

  const readyMaterials = materials.filter(m => m.status === 'ready')
  const processingMaterials = materials.filter(m => m.status === 'processing')

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      <TopBar
        title="Dashboard"
        subtitle={`${greeting}, ${user.name.split(' ')[0]}! Ready to study?`}
        actions={
          <Link href="/upload" className="btn btn-primary btn-sm">
            <Plus size={14} /> Upload
          </Link>
        }
      />

      <div style={{ padding: '1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        {/* Welcome banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.15))',
          border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20, padding: '1.5rem 2rem',
          marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple-light)', fontWeight: 600, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Flame size={14} /> {analytics.streak}-day study streak
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              {greeting}, {user.name.split(' ')[0]}! 👋
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              You&apos;ve studied <strong>{analytics.studyTime.reduce((a, b) => a + b.value, 0)} minutes</strong> this week. Keep it up!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Avg Score', value: `${analytics.averageScore}%`, icon: TrendingUp, color: '#10b981' },
              { label: 'Cards Due', value: `${decks.reduce((a, d) => a + d.studyStats.learning, 0)}`, icon: Zap, color: '#f59e0b' },
              { label: 'Study Streak', value: `${analytics.streak}d`, icon: Flame, color: '#f43f5e' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}>
                  <Icon size={11} /> {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div className="section-header">
            <h3 className="section-title">Quick Actions</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.875rem' }}>
            {QUICK_ACTIONS.map(({ href, label, icon: Icon, color, bg }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14,
                  padding: '1.1rem', textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = '' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.6rem' }}>
                    <Icon size={18} color={color} />
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          {[
            { label: 'Materials Uploaded', value: materials.length, icon: BookOpen, color: '#7c3aed', change: '+2 this week' },
            { label: 'Notes Created', value: analytics.notesCreated, icon: FileText, color: '#3b82f6', change: '+3 this week' },
            { label: 'Quizzes Taken', value: analytics.quizzesTaken, icon: Brain, color: '#10b981', change: '+1 today' },
            { label: 'Cards Reviewed', value: analytics.flashcardsReviewed, icon: Zap, color: '#f59e0b', change: '+12 today' },
          ].map(({ label, value, icon: Icon, color, change }) => (
            <div key={label} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{label}</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color }}>{value}</div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <ArrowUpRight size={11} /> {change}
                  </div>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={color} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Materials + Study Progress */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', marginBottom: '1.75rem' }}>
          {/* Recent Materials */}
          <div className="card">
            <div className="section-header">
              <h3 className="section-title">Recent Materials</h3>
              <Link href="/upload" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}>
                <Plus size={13} /> Upload New
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {materials.map(m => {
                const icons = { pdf: '📄', video: '🎬', audio: '🎵', text: '📝', image: '🖼️', url: '🔗' }
                return (
                  <div key={m.id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem',
                    background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border)',
                    transition: 'all 0.2s', cursor: 'pointer',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-light)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                      {icons[m.fileType]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{m.subject}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{formatFileSize(m.fileSize)}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>· {formatRelativeTime(m.createdAt)}</span>
                      </div>
                    </div>
                    {m.status === 'ready' ? (
                      <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                        <Link href={`/notes?material=${m.id}`} className="btn btn-ghost btn-sm btn-icon" title="View Notes"><FileText size={13} /></Link>
                        <Link href={`/quiz?material=${m.id}`} className="btn btn-ghost btn-sm btn-icon" title="Take Quiz"><Brain size={13} /></Link>
                      </div>
                    ) : (
                      <div style={{ flexShrink: 0 }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', marginBottom: '0.2rem' }}>{m.processingProgress}%</div>
                        <div className="progress-bar" style={{ width: 64 }}>
                          <div className="progress-fill" style={{ width: `${m.processingProgress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Side panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Flashcards due */}
            <div className="card">
              <div className="section-header">
                <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Zap size={15} color="#f59e0b" /> Cards Due</h3>
                <Link href="/flashcards" className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>View All</Link>
              </div>
              {decks.map(deck => (
                <div key={deck.id} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{deck.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)' }}>{deck.studyStats.learning} due</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(deck.studyStats.mastered / deck.studyStats.totalCards) * 100}%`, background: 'linear-gradient(90deg, #10b981, #3b82f6)' }} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{deck.studyStats.mastered}/{deck.studyStats.totalCards} mastered</div>
                </div>
              ))}
              <Link href="/flashcards" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <Play size={13} /> Start Review Session
              </Link>
            </div>

            {/* Quiz performance */}
            <div className="card">
              <div className="section-header">
                <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Brain size={15} color="#10b981" /> Quiz Performance</h3>
              </div>
              {quizzes.slice(0, 1).map(quiz => {
                const last = quiz.attempts[quiz.attempts.length - 1]
                const grade = getGradeLabel(last?.score || 0)
                return (
                  <div key={quiz.id}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>{quiz.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Last attempt</span>
                      <span style={{ fontWeight: 700, color: grade.color }}>{last?.score}% — {grade.label}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${last?.score || 0}%` }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <Link href={`/quiz/${quiz.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Retake</Link>
                      <Link href="/analytics" className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Details</Link>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* AI Tutor shortcut */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.1))',
              border: '1px solid rgba(124,58,237,0.25)', borderRadius: 16, padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <MessageSquare size={16} color="#a78bfa" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>AI Tutor</span>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '0.7rem', color: '#34d399' }}>Online</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.875rem', lineHeight: 1.5 }}>
                Ask your AI tutor anything about your uploaded materials — with full source citations.
              </p>
              <Link href="/tutor" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <MessageSquare size={13} /> Start Chatting
              </Link>
            </div>
          </div>
        </div>

        {/* Weak Areas & Strengths */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '1rem', color: '#fb7185' }}>⚠ Areas to Improve</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {analytics.weakAreas.map(area => (
                <div key={area} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(244,63,94,0.06)', borderRadius: 8, border: '1px solid rgba(244,63,94,0.15)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f43f5e', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{area}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '1rem', color: '#34d399' }}>✓ Your Strengths</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {analytics.strengths.map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(16,185,129,0.06)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.15)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Study time mini chart */}
        <div className="card">
          <div className="section-header">
            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={15} /> Study Time This Week</h3>
            <Link href="/analytics" className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Full Analytics <ChevronRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: 80 }}>
            {analytics.studyTime.map(({ date, value }) => {
              const maxVal = Math.max(...analytics.studyTime.map(d => d.value))
              const height = (value / maxVal) * 100
              const day = new Date(date).toLocaleDateString('en', { weekday: 'short' })
              const isToday = date === analytics.studyTime[analytics.studyTime.length - 1].date
              return (
                <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{
                    width: '100%', height: `${height}%`, minHeight: 4,
                    background: isToday ? 'linear-gradient(to top, #7c3aed, #3b82f6)' : 'var(--border)',
                    borderRadius: '4px 4px 0 0', transition: 'height 0.4s',
                  }} title={`${value} min`} />
                  <div style={{ fontSize: '0.65rem', color: isToday ? 'var(--accent-purple-light)' : 'var(--text-muted)', fontWeight: isToday ? 600 : 400 }}>{day}</div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Total: {analytics.studyTime.reduce((a, b) => a + b.value, 0)} min this week · Learning velocity: {analytics.learningVelocity}x
          </div>
        </div>
      </div>
    </div>
  )
}
