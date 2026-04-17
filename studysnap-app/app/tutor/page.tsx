'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Send, MessageSquare, BookOpen, Sparkles, Loader2, Plus, Trash2, RotateCcw } from 'lucide-react'
import TopBar from '@/components/TopBar'
import { MOCK_CHAT_SESSIONS, MOCK_MATERIALS } from '@/lib/data'
import { formatRelativeTime } from '@/lib/utils'
import type { ChatMessage } from '@/types'

export default function TutorPage() {
  const [sessions] = useState(MOCK_CHAT_SESSIONS)
  const [activeSession, setActiveSession] = useState(sessions[0])
  const [messages, setMessages] = useState<ChatMessage[]>(sessions[0]?.messages || [])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(MOCK_MATERIALS[0]?.id || '')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSession?.id,
          materialId: selectedMaterial || undefined,
          message: userMsg.content,
        }),
      })

      if (!res.ok) throw new Error('Chat API failed')
      
      const data = await res.json()
      setMessages(prev => [...prev, data.message])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: 'Sorry, I encountered an error reaching the AI tutor API. Please try again.',
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const SUGGESTED_QUESTIONS = [
    'Explain DNA replication step by step',
    'What is the role of helicase?',
    'What are Okazaki fragments?',
    'How does transcription differ from translation?',
    'Why is the genetic code considered universal?',
  ]

  return (
    <div style={{ animation: 'fadeIn 0.35s ease', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title="AI Tutor"
        subtitle="RAG-powered · answers cited from your materials"
        actions={
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Online</span>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', flex: 1, overflow: 'hidden' }}>
        {/* Session list */}
        <div style={{ borderRight: '1px solid var(--border)', overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-secondary)' }}>
          <button className="btn btn-primary btn-sm" style={{ justifyContent: 'center', marginBottom: '0.25rem' }}>
            <Plus size={13} /> New Chat
          </button>

          {/* Material selector */}
          <div style={{ padding: '0.5rem', background: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>Context Material</div>
            <select className="input" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', marginBottom: 0 }} value={selectedMaterial} onChange={e => setSelectedMaterial(e.target.value)}>
              {MOCK_MATERIALS.filter(m => m.status === 'ready').map(m => (
                <option key={m.id} value={m.id}>{m.title.slice(0, 28)}…</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 0.25rem' }}>Recent Chats</div>
          {sessions.map(s => (
            <div key={s.id}
              onClick={() => { setActiveSession(s); setMessages(s.messages) }}
              style={{
                padding: '0.65rem 0.75rem', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                background: activeSession?.id === s.id ? 'rgba(124,58,237,0.12)' : 'transparent',
                border: `1px solid ${activeSession?.id === s.id ? 'rgba(124,58,237,0.3)' : 'transparent'}`,
              }}>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{formatRelativeTime(s.updatedAt)} · {s.messages.length} msgs</div>
            </div>
          ))}
        </div>

        {/* Chat area */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Welcome */}
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Sparkles size={24} color="white" />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>AI Tutor Ready</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Ask anything about your uploaded materials. All answers are cited.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 400, margin: '0 auto' }}>
                  {SUGGESTED_QUESTIONS.map(q => (
                    <button key={q} onClick={() => { setInput(q) }}
                      style={{ padding: '0.6rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', fontSize: '0.83rem', color: 'var(--text-secondary)', textAlign: 'left', transition: 'all 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-purple)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}>
                      💬 {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={11} color="white" />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>StudySnap AI</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{formatRelativeTime(msg.timestamp)}</span>
                  </div>
                )}
                <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                  {msg.content.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} style={{ display: 'block', marginBottom: '0.25rem' }}>{line.slice(2, -2)}</strong>
                    if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) return <div key={i} style={{ paddingLeft: '0.5rem', marginBottom: '0.15rem' }}>{line}</div>
                    if (line.trim() === '') return <div key={i} style={{ height: '0.5rem' }} />
                    return <span key={i} style={{ display: 'block' }}>{line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')}</span>
                  })}
                  {msg.citations && msg.citations.length > 0 && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {msg.citations.map(c => (
                        <span key={c.id} className="citation"><BookOpen size={9} /> {c.source}, p.{c.page}</span>
                      ))}
                    </div>
                  )}
                </div>
                {msg.tokens && msg.role === 'assistant' && (
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{msg.tokens} tokens</div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={11} color="white" />
                </div>
                <div className="chat-bubble-ai" style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  <Loader2 size={14} style={{ animation: 'spin-slow 1s linear infinite' }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Searching your materials…</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
              <textarea
                className="input"
                style={{ flex: 1, resize: 'none', minHeight: 44, maxHeight: 150, padding: '0.75rem 1rem', fontSize: '0.875rem', lineHeight: 1.5 }}
                placeholder="Ask anything about your study materials…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                rows={1}
              />
              <button
                className="btn btn-primary"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                style={{ height: 44, aspectRatio: '1', justifyContent: 'center', borderRadius: 12 }}
              >
                {loading ? <Loader2 size={17} style={{ animation: 'spin-slow 1s linear infinite' }} /> : <Send size={17} />}
              </button>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Press Enter to send · Shift+Enter for new line · All answers grounded in your source material
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
