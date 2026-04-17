'use client'
import React, { useState } from 'react'
import {
  TrendingUp, Clock, Brain, Zap, Flame, Target, BarChart2, Award
} from 'lucide-react'
import TopBar from '@/components/TopBar'
import { MOCK_ANALYTICS } from '@/lib/data'
import { getGradeLabel } from '@/lib/utils'

const PERIODS = ['Week', 'Month', 'Year']

export default function AnalyticsPage() {
  const analytics = MOCK_ANALYTICS
  const [period, setPeriod] = useState('Week')

  const maxStudyTime = Math.max(...analytics.studyTime.map(d => d.value))
  const maxScore = 100

  const grade = getGradeLabel(analytics.averageScore)
  const totalTime = analytics.studyTime.reduce((a, b) => a + b.value, 0)

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      <TopBar
        title="Learning Analytics"
        subtitle="Track your progress and identify areas for improvement"
        actions={
          <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.2rem', gap: '0.2rem' }}>
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                style={{ padding: '0.3rem 0.85rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.15s', background: period === p ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'transparent', color: period === p ? 'white' : 'var(--text-secondary)' }}>
                {p}
              </button>
            ))}
          </div>
        }
      />

      <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        {/* Hero stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          {[
            { label: 'Study Time', value: `${totalTime}m`, icon: Clock, color: '#7c3aed', sub: `${period.toLowerCase()}` },
            { label: 'Avg Quiz Score', value: `${analytics.averageScore}%`, icon: Brain, color: '#10b981', sub: grade.label },
            { label: 'Cards Reviewed', value: analytics.flashcardsReviewed, icon: Zap, color: '#f59e0b', sub: 'this week' },
            { label: 'Study Streak', value: `${analytics.streak}d`, icon: Flame, color: '#f43f5e', sub: 'consecutive days' },
            { label: 'Materials', value: analytics.materialsStudied, icon: BarChart2, color: '#3b82f6', sub: 'studied' },
            { label: 'Velocity', value: `${analytics.learningVelocity}x`, icon: TrendingUp, color: '#ec4899', sub: 'avg growth' },
          ].map(({ label, value, icon: Icon, color, sub }) => (
            <div key={label} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={color} />
                </div>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color, marginTop: '0.5rem' }}>{value}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.1rem' }}>{label}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
          {/* Study time chart */}
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={15} color="#7c3aed" /> Study Time per Day
            </h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', height: 120 }}>
              {analytics.studyTime.map(({ date, value }) => {
                const h = (value / maxStudyTime) * 100
                const day = new Date(date).toLocaleDateString('en', { weekday: 'short' })
                const isToday = date === analytics.studyTime[analytics.studyTime.length - 1].date
                return (
                  <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{value}m</span>
                    <div style={{
                      width: '100%', height: `${h}%`, minHeight: 4,
                      background: isToday ? 'linear-gradient(to top, #7c3aed, #3b82f6)' : 'var(--border-light)',
                      borderRadius: '4px 4px 0 0', transition: 'all 0.4s',
                    }} />
                    <span style={{ fontSize: '0.65rem', color: isToday ? 'var(--accent-purple-light)' : 'var(--text-muted)', fontWeight: isToday ? 600 : 400 }}>{day}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quiz score chart */}
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={15} color="#10b981" /> Quiz Score Trend
            </h3>
            <div style={{ position: 'relative', height: 120 }}>
              {/* Grid lines */}
              {[25, 50, 75, 100].map(v => (
                <div key={v} style={{ position: 'absolute', left: 0, right: 0, bottom: `${v}%`, borderTop: '1px dashed var(--border)', zIndex: 0 }}>
                  <span style={{ position: 'absolute', left: 0, fontSize: '0.6rem', color: 'var(--text-muted)', top: -8 }}>{v}%</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', height: '100%', position: 'relative', zIndex: 1 }}>
                {analytics.quizScores.map(({ date, value }, i) => {
                  const h = (value / maxScore) * 100
                  const day = new Date(date).toLocaleDateString('en', { weekday: 'short' })
                  const isLatest = i === analytics.quizScores.length - 1
                  const color = value >= 80 ? '#10b981' : value >= 65 ? '#3b82f6' : '#f59e0b'
                  return (
                    <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ fontSize: '0.63rem', color }}>{value}%</span>
                      <div style={{ width: '100%', height: `${h}%`, minHeight: 4, background: isLatest ? 'linear-gradient(to top, #10b981, #3b82f6)' : color, borderRadius: '4px 4px 0 0', opacity: isLatest ? 1 : 0.6 }} />
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{day}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Subject breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={15} color="#f59e0b" /> Top Subjects
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {analytics.topSubjects.map(({ subject, score, time }) => {
                const grade = getGradeLabel(score)
                return (
                  <div key={subject}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{subject}</span>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{time}m studied</span>
                        <span style={{ fontWeight: 700, color: grade.color, fontSize: '0.83rem' }}>{score}%</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${grade.color}, ${grade.color}88)` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Study Heatmap</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {Array(35).fill(0).map((_, i) => {
                const intensity = Math.random()
                const bg = intensity > 0.7 ? '#7c3aed' : intensity > 0.4 ? '#3b82f644' : intensity > 0.1 ? 'var(--border-light)' : 'var(--border)'
                return <div key={i} style={{ aspectRatio: '1', borderRadius: 3, background: bg, transition: 'all 0.15s', cursor: 'pointer' }} title={`${Math.round(intensity * 120)} min`} />
              })}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Less
              {['var(--border)', 'var(--border-light)', '#3b82f644', '#7c3aed'].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
              ))}
              More
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Learning Insights</h4>
              {[
                { text: `You're most productive on Thursdays and Saturdays`, icon: '📈' },
                { text: `Biology retention improved 14% this week`, icon: '🧬' },
                { text: `Quiz accuracy trending upward for 7 consecutive days`, icon: '🎯' },
              ].map(({ text, icon }) => (
                <div key={text} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0 }}>{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weak areas / strengths split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '1rem', color: '#fb7185' }}>⚠ Areas Needing Focus</h3>
            {analytics.weakAreas.map((area, i) => (
              <div key={area} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', background: 'rgba(244,63,94,0.06)', borderRadius: 8, marginBottom: '0.5rem', border: '1px solid rgba(244,63,94,0.15)' }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: '#fb7185', fontWeight: 700 }}>{i + 1}</div>
                <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', flex: 1 }}>{area}</span>
                <button className="btn btn-ghost btn-sm btn-icon" title="Study this topic" style={{ fontSize: '0.72rem', color: '#fb7185' }}>Practice →</button>
              </div>
            ))}
          </div>
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '1rem', color: '#34d399' }}>✓ What You&apos;ve Mastered</h3>
            {analytics.strengths.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', background: 'rgba(16,185,129,0.06)', borderRadius: 8, marginBottom: '0.5rem', border: '1px solid rgba(16,185,129,0.15)' }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>✓</div>
                <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
