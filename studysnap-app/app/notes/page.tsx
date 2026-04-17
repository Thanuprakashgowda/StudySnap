'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import {
  FileText, Star, Edit3, Download, Share2, Search, Filter,
  ChevronRight, BookOpen, Tag, Clock, Copy, Check
} from 'lucide-react'
import TopBar from '@/components/TopBar'
import { MOCK_NOTES, MOCK_MATERIALS } from '@/lib/data'
import { formatRelativeTime } from '@/lib/utils'

export default function NotesPage() {
  const [search, setSearch] = useState('')
  const [selectedNote, setSelectedNote] = useState(MOCK_NOTES[0])
  const [editMode, setEditMode] = useState(false)
  const [content, setContent] = useState(MOCK_NOTES[0]?.content || '')
  const [copied, setCopied] = useState(false)

  const filtered = MOCK_NOTES.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getMaterialTitle = (materialId: string) =>
    MOCK_MATERIALS.find(m => m.id === materialId)?.title || 'Unknown'

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      <TopBar
        title="My Notes"
        subtitle={`${MOCK_NOTES.length} notes generated from your materials`}
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" style={{ paddingLeft: '2.2rem', height: 36, width: 200, fontSize: '0.8rem' }} placeholder="Search notes…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: 'calc(100vh - 57px)', overflow: 'hidden' }}>
        {/* Note list */}
        <div style={{ borderRight: '1px solid var(--border)', overflowY: 'auto', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No notes found</div>
          ) : filtered.map(note => (
            <div key={note.id}
              onClick={() => { setSelectedNote(note); setContent(note.content); setEditMode(false) }}
              style={{
                padding: '0.875rem', borderRadius: 12, border: `1px solid ${selectedNote?.id === note.id ? 'rgba(124,58,237,0.4)' : 'var(--border)'}`,
                background: selectedNote?.id === note.id ? 'rgba(124,58,237,0.1)' : 'var(--bg-card)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.3, flex: 1 }}>{note.title}</span>
                {note.isFavorite && <Star size={12} color="#f59e0b" fill="#f59e0b" style={{ flexShrink: 0, marginLeft: '0.3rem' }} />}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {note.summary}
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {note.tags.slice(0, 2).map(t => (
                  <span key={t} className="badge badge-purple" style={{ fontSize: '0.6rem' }}>{t}</span>
                ))}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{formatRelativeTime(note.updatedAt)}</div>
            </div>
          ))}
        </div>

        {/* Note viewer/editor */}
        {selectedNote ? (
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* Note toolbar */}
            <div style={{ padding: '0.875rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-secondary)', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedNote.title}</h2>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <BookOpen size={11} /> {getMaterialTitle(selectedNote.materialId)}
                  <span>·</span><Clock size={11} /> Updated {formatRelativeTime(selectedNote.updatedAt)}
                  {selectedNote.isEdited && <span className="badge badge-amber" style={{ fontSize: '0.6rem' }}>Edited</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setEditMode(e => !e)} className={`btn ${editMode ? 'btn-primary' : 'btn-secondary'} btn-sm`}>
                  <Edit3 size={13} /> {editMode ? 'Save' : 'Edit'}
                </button>
                <button onClick={handleCopy} className="btn btn-secondary btn-sm">
                  {copied ? <><Check size={13} color="#10b981" /> Copied!</> : <><Copy size={13} /> Copy</>}
                </button>
                <button className="btn btn-secondary btn-sm"><Download size={13} /> Export</button>
                <button className="btn btn-ghost btn-sm"><Share2 size={13} /></button>
              </div>
            </div>

            {/* Key points */}
            <div style={{ padding: '1rem 1.5rem', background: 'rgba(124,58,237,0.06)', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-purple-light)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Points</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {selectedNote.keyPoints.map((kp, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent-purple)', fontWeight: 700, flexShrink: 0 }}>→</span> {kp}
                  </div>
                ))}
              </div>
            </div>

            {/* Citations */}
            {selectedNote.citations.length > 0 && (
              <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(59,130,246,0.05)', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>SOURCES:</span>
                {selectedNote.citations.map(c => (
                  <span key={c.id} className="citation">[p.{c.page}] {c.source.slice(0, 20)}… ({Math.round(c.confidence * 100)}%)</span>
                ))}
              </div>
            )}

            {/* Content area */}
            <div style={{ flex: 1, padding: '1.5rem', maxWidth: 760, margin: '0 auto', width: '100%' }}>
              {editMode ? (
                <textarea
                  className="input"
                  style={{ minHeight: '60vh', fontFamily: 'monospace', fontSize: '0.875rem', padding: '1rem', lineHeight: 1.7 }}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              ) : (
                <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {content.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', marginTop: i > 0 ? '1.5rem' : 0 }}>{line.slice(2)}</h1>
                    if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', marginTop: '1.25rem' }}>{line.slice(3)}</h2>
                    if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem', marginTop: '1rem' }}>{line.slice(4)}</h3>
                    if (line.startsWith('- ')) return <li key={i} style={{ marginBottom: '0.3rem', marginLeft: '1rem', listStyle: 'none', display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--accent-purple)' }}>•</span>{line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}</li>
                    if (line.trim() === '') return <div key={i} style={{ height: '0.75rem' }} />
                    return <p key={i} style={{ marginBottom: '0.5rem' }}>{line.replace(/\*\*(.*?)\*\*/g, (_, t) => t)}</p>
                  })}
                </div>
              )}
            </div>

            {/* Action bar */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedNote.tags.map(tag => <span key={tag} className="tag active"><Tag size={10} />{tag}</span>)}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href={`/quiz?note=${selectedNote.id}`} className="btn btn-secondary btn-sm"><ChevronRight size={13} /> Generate Quiz</Link>
                <Link href={`/flashcards?note=${selectedNote.id}`} className="btn btn-primary btn-sm">Make Flashcards</Link>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: '0.5rem' }}>
            <FileText size={40} style={{ opacity: 0.3 }} />
            <span>Select a note to view</span>
          </div>
        )}
      </div>
    </div>
  )
}
