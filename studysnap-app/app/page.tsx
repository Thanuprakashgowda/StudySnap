'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen, Zap, Brain, BarChart3, Users, Shield,
  ChevronRight, Star, Check, Menu, X, Sun, Moon,
  Upload, MessageSquare, FileText, Sparkles, Globe, Lock,
  ArrowRight, PlayCircle
} from 'lucide-react'
import { useApp } from '@/lib/context'

const FEATURES = [
  {
    icon: Upload, title: 'Smart Upload & Transcribe',
    desc: 'Drop any PDF, video, or audio. Our AI transcribes and indexes it instantly — even in low-bandwidth environments.',
    color: '#7c3aed', gradient: 'linear-gradient(135deg, #7c3aed22, #3b82f622)',
  },
  {
    icon: FileText, title: 'Editable AI Notes',
    desc: 'Every note is fully editable, citable, and version-controlled. Never lose a change. Export to PDF, Word, or Markdown.',
    color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f622, #06b6d422)',
  },
  {
    icon: Brain, title: 'Adaptive Quizzes',
    desc: 'Quizzes that get smarter with you. Adaptive difficulty, source-grounded explanations, and detailed performance tracking.',
    color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d422, #10b98122)',
  },
  {
    icon: Zap, title: 'Spaced Repetition Flashcards',
    desc: 'AI-generated flashcards with scientifically-proven spaced repetition scheduling for maximum retention.',
    color: '#10b981', gradient: 'linear-gradient(135deg, #10b98122, #f59e0b22)',
  },
  {
    icon: MessageSquare, title: 'RAG AI Tutor',
    desc: 'Ask anything about your material. Every answer is cited back to your uploaded source. No hallucinations.',
    color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b22, #f43f5e22)',
  },
  {
    icon: BarChart3, title: 'Learning Analytics',
    desc: 'Track study time, quiz scores, streaks, and learning velocity. Identify weak areas automatically.',
    color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e22, #7c3aed22)',
  },
  {
    icon: Users, title: 'Collaboration Workspace',
    desc: 'Share notes, discuss concepts, and study together with invite-based group workspaces.',
    color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf622, #3b82f622)',
  },
  {
    icon: Globe, title: 'Multilingual Support',
    desc: 'Transcribe and study in 10+ languages. Perfect for international students and multilingual learners.',
    color: '#ec4899', gradient: 'linear-gradient(135deg, #ec489922, #f59e0b22)',
  },
]

const PRICING = [
  {
    name: 'Free', price: 0, period: 'forever',
    features: ['5 uploads / month', 'Basic AI notes', '10 quizzes / month', 'Community support'],
    cta: 'Get Started Free', highlight: false,
  },
  {
    name: 'Pro', price: 12, period: 'per month',
    features: ['Unlimited uploads', 'Advanced AI tutor', 'Adaptive quizzes', 'Analytics dashboard', 'Export all formats', 'Priority support'],
    cta: 'Start Pro Trial', highlight: true,
  },
  {
    name: 'Team', price: 8, period: 'per user/month',
    features: ['Everything in Pro', 'Collaboration workspaces', 'Admin dashboard', 'SSO & privacy controls', 'Custom branding', 'Dedicated support'],
    cta: 'Contact Sales', highlight: false,
  },
]

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Medical Student, AIIMS', text: 'StudySnap+ saved me 3 hours per lecture. The AI-cited answers are a game changer for exam prep.', rating: 5, avatar: 'PS' },
  { name: 'Carlos Mendez', role: 'PhD Candidate, MIT', text: 'The RAG tutor actually understands my research papers. No other tool does this with proper citations.', rating: 5, avatar: 'CM' },
  { name: 'Jung-ah Kim', role: 'International Student, UCL', text: 'Studying in English as a Korean speaker? The multilingual support and clear notes make it manageable.', rating: 5, avatar: 'JK' },
]

const STATS = [
  { value: '2.4M+', label: 'Notes Generated' },
  { value: '98%', label: 'Accuracy Rate' },
  { value: '150+', label: 'Universities' },
  { value: '12 mins', label: 'Avg. Time Saved / Lecture' },
]

export default function LandingPage() {
  const { theme, toggleTheme } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* Nav */}
      <nav className="landing-nav" style={{
        background: scrolled ? 'var(--bg-secondary)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={16} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>StudySnap<span style={{ color: '#7c3aed' }}>+</span></span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden md:flex">
          {['Features', 'Pricing', 'About'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>{item}</a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={toggleTheme} className="btn btn-ghost btn-icon" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link href="/login" className="btn btn-secondary btn-sm" style={{ display: (typeof window !== 'undefined' && window.innerWidth < 768) ? 'none' : '' }}>Log in</Link>
          <Link href="/signup" className="btn btn-primary btn-sm">Get Started</Link>
          <button onClick={() => setMenuOpen(o => !o)} className="btn btn-ghost btn-icon" style={{ display: 'block' }} aria-label="Menu">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)', padding: '1.5rem', zIndex: 45,
          display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.2s ease',
        }}>
          {['Features', 'Pricing', 'About'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
              style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>{item}</a>
          ))}
          <Link href="/login" className="btn btn-secondary" onClick={() => setMenuOpen(false)}>Log in</Link>
          <Link href="/signup" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
        </div>
      )}

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="badge badge-purple" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
            <Sparkles size={12} /> AI-Powered Learning Platform
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Turn Any Lecture into{' '}
            <span className="gradient-text">Mastery</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Upload PDFs, videos, or audio. Get AI-generated notes, adaptive quizzes, flashcards, and a grounded AI tutor — all cited back to your source material.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn btn-primary btn-lg">
              Start for Free <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              <PlayCircle size={18} /> See How It Works
            </a>
          </div>
          <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            No credit card required · Free forever plan · GDPR compliant
          </p>

          {/* Hero Preview Card */}
          <div style={{ marginTop: '4rem', position: 'relative' }}>
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20,
              padding: '1.5rem', textAlign: 'left', boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
              maxWidth: 680, margin: '0 auto',
            }} className="animate-float">
              {/* Fake browser chrome */}
              <div style={{ display: 'flex', gap: 6, marginBottom: '1rem' }}>
                {['#f43f5e', '#f59e0b', '#10b981'].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                ))}
                <div style={{ flex: 1, background: 'var(--bg-input)', borderRadius: 6, height: 10, marginLeft: '0.5rem' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: '📄 AI Notes', value: 'DNA Replication — Key Enzymes...', color: '#7c3aed' },
                  { label: '🧠 Adaptive Quiz', value: 'Score: 88% · Next: Hard Mode', color: '#10b981' },
                  { label: '⚡ Flashcards', value: '5 cards due today · 4-day streak', color: '#f59e0b' },
                  { label: '💬 AI Tutor', value: '"Why is replication semi-conservative?"', color: '#3b82f6' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ padding: '0.875rem', background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color, marginBottom: '0.35rem' }}>{label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '2rem 1.5rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div style={{ fontSize: '2rem', fontWeight: 800 }} className="gradient-text">{value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '6rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="badge badge-blue" style={{ marginBottom: '1rem', display: 'inline-flex' }}>Features</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, marginBottom: '1rem' }}>
            Everything You Need to <span className="gradient-text-2">Learn Smarter</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', fontSize: '1rem' }}>
            Built to solve real gaps in EdTech: measurable outcomes, real personalization, full transparency.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {FEATURES.map(({ icon: Icon, title, desc, color, gradient }) => (
            <div key={title} className="card" style={{ background: gradient, borderColor: 'transparent' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}22`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>{title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '6rem 1.5rem', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div className="badge badge-green" style={{ marginBottom: '1rem', display: 'inline-flex' }}>How It Works</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 700, marginBottom: '3rem' }}>
            From Upload to <span className="gradient-text">Exam-Ready</span> in Minutes
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {[
              { step: '01', title: 'Upload Your Material', desc: 'PDF, video, audio, or paste a URL. We support 10+ languages and low-bandwidth uploads.' },
              { step: '02', title: 'AI Processes & Indexes', desc: 'Transcription, OCR, and RAG indexing happen automatically. Usually takes under 2 minutes.' },
              { step: '03', title: 'Study with AI Tools', desc: 'Notes, quizzes, flashcards, and tutor chat — all grounded in your source content.' },
              { step: '04', title: 'Track Your Progress', desc: 'Analytics dashboard shows your weak areas, study streak, and learning velocity.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
                  fontSize: '0.8rem', fontWeight: 700, color: 'white', letterSpacing: '0.05em',
                }}>{step}</div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '6rem 1.5rem', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="badge badge-amber" style={{ marginBottom: '1rem', display: 'inline-flex' }}>Pricing</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 700 }}>
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          {PRICING.map(({ name, price, period, features, cta, highlight }) => (
            <div key={name} className={highlight ? 'gradient-border' : 'card'} style={{
              padding: '2rem', borderRadius: 20, position: 'relative',
              ...(highlight ? { background: 'var(--bg-card)' } : {}),
            }}>
              {highlight && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: 'white',
                  padding: '0.2rem 0.8rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap',
                }}>Most Popular ✦</div>
              )}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>${price}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/{period}</span>
                </div>
              </div>
              <ul style={{ listStyle: 'none', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <Check size={15} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={`btn ${highlight ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'center' }}>{cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '6rem 1.5rem', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <div className="badge badge-rose" style={{ marginBottom: '1rem', display: 'inline-flex' }}>Testimonials</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 700, marginBottom: '3rem' }}>
            Loved by Students Worldwide
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
            {TESTIMONIALS.map(({ name, role, text, rating, avatar }) => (
              <div key={name} className="card">
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {Array(rating).fill(0).map((_, i) => <Star key={i} size={14} color="#f59e0b" fill="#f59e0b" />)}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>&ldquo;{text}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'white',
                  }}>{avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-glow" style={{ background: 'rgba(124,58,237,0.2)', width: 400, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Lock size={14} color="#10b981" />
            <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>GDPR Compliant · Your data, always yours</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Study{' '}<span className="gradient-text">Smarter?</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Join 50,000+ students already using StudySnap+ to ace their exams.
          </p>
          <Link href="/signup" className="btn btn-primary btn-lg animate-pulse-glow">
            Get Started Free <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={12} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>StudySnap+</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['Privacy', 'Terms', 'Accessibility', 'Admin'].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>{item}</Link>
            ))}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>© 2026 StudySnap+. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
