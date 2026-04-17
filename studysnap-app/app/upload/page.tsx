'use client'
import React, { useState, useRef, useCallback } from 'react'
import { Upload, FileText, Film, Music, Image, Link, X, CheckCircle, AlertCircle, ChevronRight, Loader2, Globe } from 'lucide-react'
import TopBar from '@/components/TopBar'
import { SUBJECTS, LANGUAGES, formatFileSize } from '@/lib/utils'

type FileItem = {
  id: string
  file?: File
  url?: string
  name: string
  size?: number
  type: 'pdf' | 'video' | 'audio' | 'image' | 'url' | 'text'
  status: 'pending' | 'uploading' | 'transcribing' | 'done' | 'error'
  progress: number
}

const FILE_TYPES = [
  { type: 'pdf' as const, label: 'PDF / Document', icon: FileText, accept: '.pdf,.doc,.docx,.txt', color: '#f43f5e' },
  { type: 'video' as const, label: 'Video Lecture', icon: Film, accept: 'video/*', color: '#7c3aed' },
  { type: 'audio' as const, label: 'Audio / Podcast', icon: Music, accept: 'audio/*', color: '#3b82f6' },
  { type: 'image' as const, label: 'Image / Slides', icon: Image, accept: 'image/*', color: '#10b981' },
]

export default function UploadPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [url, setUrl] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [subject, setSubject] = useState('')
  const [language, setLanguage] = useState('en')
  const [autoQuiz, setAutoQuiz] = useState(true)
  const [autoFlash, setAutoFlash] = useState(true)
  const [tab, setTab] = useState<'file' | 'url'>('file')
  const fileRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((incoming: File[]) => {
    const newFiles: FileItem[] = incoming.map(f => {
      let type: FileItem['type'] = 'pdf'
      if (f.type.startsWith('video')) type = 'video'
      else if (f.type.startsWith('audio')) type = 'audio'
      else if (f.type.startsWith('image')) type = 'image'
      return { id: Math.random().toString(36).slice(2), file: f, name: f.name, size: f.size, type, status: 'pending', progress: 0 }
    })
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = Array.from(e.dataTransfer.files)
    if (dropped.length) addFiles(dropped)
  }, [addFiles])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files))
  }

  const addUrl = () => {
    if (!url.trim()) return
    const item: FileItem = { id: Math.random().toString(36).slice(2), url, name: new URL(url).hostname, type: 'url', status: 'pending', progress: 0 }
    setFiles(prev => [...prev, item])
    setUrl('')
  }

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id))

  const simulateUpload = async (id: string) => {
    const fileItem = files.find(f => f.id === id)
    if (!fileItem) return

    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading', progress: 10 } : f))

    try {
      const formData = new FormData()
      if (fileItem.file) {
        formData.append('file', fileItem.file)
      } else if (fileItem.url) {
        formData.append('url', fileItem.url)
      }
      formData.append('subject', subject)
      formData.append('language', language)
      formData.append('autoQuiz', String(autoQuiz))
      formData.append('autoFlash', String(autoFlash))

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')
      
      const data = await res.json()
      
      // Poll for processing progress
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'transcribing', progress: 20 } : f))
      let isDone = false

      while (!isDone) {
        await new Promise(r => setTimeout(r, 2000))
        const pollRes = await fetch(`/api/upload?materialId=${data.materialId}`)
        if (pollRes.ok) {
          const pollData = await pollRes.json()
          setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: pollData.processingProgress } : f))
          
          if (pollData.status === 'ready') {
            isDone = true
            setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'done', progress: 100 } : f))
          } else if (pollData.status === 'error') {
            isDone = true
            throw new Error(pollData.errorMessage || 'Processing failed')
          }
        }
      }
    } catch (err) {
      console.error(err)
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error' } : f))
    }
  }

  const handleUploadAll = () => {
    files.filter(f => f.status === 'pending').forEach(f => simulateUpload(f.id))
  }

  const typeIcon = (type: FileItem['type']) => {
    const map = { pdf: '📄', video: '🎬', audio: '🎵', image: '🖼️', url: '🔗', text: '📝' }
    return map[type]
  }

  const pendingCount = files.filter(f => f.status === 'pending').length
  const doneCount = files.filter(f => f.status === 'done').length

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      <TopBar title="Upload Material" subtitle="Add PDFs, videos, audio, or URLs to generate AI study content" />
      <div style={{ padding: '1.5rem', maxWidth: 820, margin: '0 auto' }}>

        {/* Tab */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-card)', padding: '0.3rem', borderRadius: 12, width: 'fit-content', border: '1px solid var(--border)' }}>
          {[{ key: 'file', label: '📁 Upload Files' }, { key: 'url', label: '🔗 Import URL' }].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key as 'file' | 'url')}
              style={{
                padding: '0.45rem 1.1rem', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s',
                background: tab === key ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'transparent',
                color: tab === key ? 'white' : 'var(--text-secondary)',
              }}>{label}</button>
          ))}
        </div>

        {tab === 'file' ? (
          <>
            {/* Drop zone */}
            <div
              className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
              style={{ marginBottom: '1.25rem' }}
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,video/*,audio/*,image/*" onChange={handleFileInput} style={{ display: 'none' }} />
              <div style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>📂</div>
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.35rem' }}>Drop files here or click to browse</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginBottom: '1.25rem' }}>PDF, DOC, MP4, MP3, JPG, PNG — up to 500 MB</div>
              <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {FILE_TYPES.map(({ label, icon: Icon, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.7rem', background: 'var(--bg-card)', borderRadius: 100, border: '1px solid var(--border)', fontSize: '0.75rem', color }}>
                    <Icon size={12} /> {label}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Import from URL</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Globe size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" style={{ paddingLeft: '2.5rem' }} placeholder="https://youtube.com/watch?v=..." value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && addUrl()} />
              </div>
              <button className="btn btn-primary" onClick={addUrl} disabled={!url.trim()}>Import</button>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Supports: YouTube, Google Drive, Dropbox, ArXiv, Wikipedia, and any public webpage
            </div>
          </div>
        )}

        {/* File list */}
        {files.length > 0 && (
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div className="section-header">
              <h3 className="section-title">Files to Upload ({files.length})</h3>
              <button onClick={() => setFiles([])} className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-rose)', fontSize: '0.75rem' }}>Clear all</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {files.map(f => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-input)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.25rem', flexShrink: 0 }}>{typeIcon(f.type)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                    {f.size && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{formatFileSize(f.size)}</div>}
                    {(f.status === 'uploading' || f.status === 'transcribing') && (
                      <div style={{ marginTop: '0.35rem' }}>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${f.progress}%` }} />
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {f.status === 'uploading' ? `Uploading… ${f.progress}%` : 'Transcribing & indexing…'}
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {f.status === 'pending' && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Ready</span>}
                    {f.status === 'uploading' && <Loader2 size={16} color="var(--accent-blue)" style={{ animation: 'spin-slow 1s linear infinite' }} />}
                    {f.status === 'transcribing' && <Loader2 size={16} color="var(--accent-purple)" style={{ animation: 'spin-slow 1s linear infinite' }} />}
                    {f.status === 'done' && <CheckCircle size={16} color="#10b981" />}
                    {f.status === 'error' && <AlertCircle size={16} color="#f43f5e" />}
                  </div>
                  {f.status === 'pending' && (
                    <button onClick={() => removeFile(f.id)} className="btn btn-ghost btn-icon btn-sm"><X size={13} /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 className="section-title" style={{ marginBottom: '1rem' }}>Processing Options</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Subject Area</label>
              <select className="input" value={subject} onChange={e => setSubject(e.target.value)}>
                <option value="">Auto-detect</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Language</label>
              <select className="input" value={language} onChange={e => setLanguage(e.target.value)}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {[
              { key: 'autoQuiz', label: 'Auto-generate quiz', value: autoQuiz, set: setAutoQuiz },
              { key: 'autoFlash', label: 'Auto-generate flashcards', value: autoFlash, set: setAutoFlash },
            ].map(({ key, label, value, set }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <div style={{
                  width: 36, height: 20, borderRadius: 10, background: value ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'var(--border)',
                  position: 'relative', transition: 'all 0.2s', cursor: 'pointer',
                }} onClick={() => set((v: boolean) => !v)}>
                  <div style={{
                    position: 'absolute', top: 2, left: value ? 18 : 2, width: 16, height: 16,
                    borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }} />
                </div>
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Upload button */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          {doneCount > 0 && (
            <a href="/notes" className="btn btn-secondary">
              View Generated Notes <ChevronRight size={14} />
            </a>
          )}
          <button
            className="btn btn-primary btn-lg"
            disabled={pendingCount === 0}
            onClick={handleUploadAll}
          >
            <Upload size={16} />
            {pendingCount > 0 ? `Upload ${pendingCount} File${pendingCount > 1 ? 's' : ''}` : 'All Uploaded ✓'}
          </button>
        </div>
      </div>
    </div>
  )
}
