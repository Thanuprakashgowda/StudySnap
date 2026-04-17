'use client'
import React, { useState } from 'react'
import { Users, MessageCircle, Plus, Check, X, ChevronRight, Copy, Link } from 'lucide-react'
import TopBar from '@/components/TopBar'
import { MOCK_WORKSPACE } from '@/lib/data'
import { formatRelativeTime, getInitials } from '@/lib/utils'

export default function CollaboratePage() {
  const ws = MOCK_WORKSPACE
  const [newReply, setNewReply] = useState<Record<string, string>>({})
  const [discussions, setDiscussions] = useState(ws.discussions)
  const [codeCopied, setCodeCopied] = useState(false)

  const ROLE_COLOR: Record<string, string> = { owner: '#7c3aed', editor: '#3b82f6', viewer: '#6b7280' }

  const handleReply = (discId: string) => {
    const text = newReply[discId]
    if (!text?.trim()) return
    setDiscussions(prev => prev.map(d => d.id === discId ? {
      ...d,
      replies: [...d.replies, { id: Math.random().toString(36).slice(2), authorId: 'user-1', authorName: 'Alex Johnson', content: text, createdAt: new Date().toISOString() }]
    } : d))
    setNewReply(prev => ({ ...prev, [discId]: '' }))
  }

  const copyCode = () => {
    navigator.clipboard.writeText(ws.inviteCode)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      <TopBar
        title="Collaborate"
        subtitle="Work together with your study group"
        actions={<button className="btn btn-primary btn-sm"><Plus size={14} /> New Workspace</button>}
      />
      <div style={{ padding: '1.5rem', maxWidth: 1000, margin: '0 auto' }}>
        {/* Workspace header */}
        <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(59,130,246,0.08))', borderColor: 'rgba(124,58,237,0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <Users size={16} color="#a78bfa" />
                <h2 style={{ fontWeight: 700, fontSize: '1.15rem' }}>{ws.name}</h2>
                {ws.isPublic && <span className="badge badge-green">Public</span>}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: 500 }}>{ws.description}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ padding: '0.5rem 0.875rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Invite code:</span>
                <code style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-purple-light)' }}>{ws.inviteCode}</code>
                <button onClick={copyCode} className="btn btn-ghost btn-icon btn-sm">{codeCopied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}</button>
              </div>
              <button className="btn btn-secondary btn-sm"><Link size={13} /> Share Link</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem' }}>
          {/* Discussions */}
          <div>
            <div className="section-header">
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageCircle size={15} /> Discussions ({discussions.length})</h3>
              <button className="btn btn-primary btn-sm"><Plus size={13} /> New Discussion</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {discussions.map(d => (
                <div key={d.id} className="card">
                  {/* Thread header */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      {getInitials(d.authorName)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{d.authorName}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{formatRelativeTime(d.createdAt)}</span>
                        </div>
                        {d.isResolved ? (
                          <span className="badge badge-green" style={{ fontSize: '0.65rem' }}><Check size={10} /> Resolved</span>
                        ) : (
                          <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>Open</span>
                        )}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginTop: '0.3rem' }}>{d.content}</p>
                      {d.noteId && (
                        <div style={{ marginTop: '0.35rem' }}><span className="citation">📄 Linked to note</span></div>
                      )}
                    </div>
                  </div>

                  {/* Replies */}
                  {d.replies.length > 0 && (
                    <div style={{ marginLeft: '2.5rem', borderLeft: '2px solid var(--border)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      {d.replies.map(r => (
                        <div key={r.id} style={{ display: 'flex', gap: '0.625rem' }}>
                          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0, border: '1px solid var(--border)' }}>
                            {getInitials(r.authorName)}
                          </div>
                          <div>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.15rem' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{r.authorName}</span>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{formatRelativeTime(r.createdAt)}</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', lineHeight: 1.5 }}>{r.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply input */}
                  <div style={{ marginLeft: '2.5rem', display: 'flex', gap: '0.5rem' }}>
                    <input
                      className="input"
                      style={{ flex: 1, fontSize: '0.83rem', padding: '0.5rem 0.875rem' }}
                      placeholder="Write a reply…"
                      value={newReply[d.id] || ''}
                      onChange={e => setNewReply(p => ({ ...p, [d.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleReply(d.id)}
                    />
                    <button className="btn btn-primary btn-sm" onClick={() => handleReply(d.id)} disabled={!newReply[d.id]?.trim()}>Reply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Members panel */}
          <div>
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <h3 className="section-title" style={{ marginBottom: '1rem' }}>Members ({ws.members.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {ws.members.map(m => (
                  <div key={m.userId} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed55, #3b82f655)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                        {getInitials(m.name)}
                      </div>
                      {m.userId === 'user-1' || m.userId === 'user-3' ? (
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: '#10b981', border: '1px solid var(--bg-card)' }} />
                      ) : null}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.83rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                      <div style={{ fontSize: '0.68rem', color: ROLE_COLOR[m.role] || 'var(--text-muted)', textTransform: 'capitalize' }}>{m.role}</div>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{formatRelativeTime(m.lastActive)}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                <Plus size={13} /> Invite Member
              </button>
            </div>

            {/* Shared materials */}
            <div className="card">
              <h3 className="section-title" style={{ marginBottom: '1rem' }}>Shared Materials</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['📄 Intro to Molecular Biology', '🎬 Quantum Mechanics Wave Functions'].map(m => (
                  <div key={m} style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-input)', borderRadius: 8, border: '1px solid var(--border)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{m}</span>
                    <ChevronRight size={12} color="var(--text-muted)" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
