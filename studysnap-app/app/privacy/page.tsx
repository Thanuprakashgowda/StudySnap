'use client'
import React from 'react'
import Link from 'next/link'
import { BookOpen, Shield, Lock, Eye, Download, Server, Globe } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 740, margin: '0 auto' }}>
        {/* Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={15} color="white" />
            </div>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>StudySnap<span style={{ color: '#7c3aed' }}>+</span></span>
          </Link>
          <Link href="/dashboard" className="btn btn-secondary btn-sm">Dashboard →</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Shield size={24} color="#7c3aed" />
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Privacy Policy</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '3rem' }}>Last updated: April 17, 2026 · GDPR Compliant · FERPA Compliant</p>

        {[
          {
            icon: Eye, title: 'What We Collect',
            content: 'We collect only what is necessary to provide the StudySnap+ service: your email address, uploaded study materials, generated notes/quizzes, and anonymized usage analytics. We never collect sensitive personal data beyond what you voluntarily provide.',
          },
          {
            icon: Lock, title: 'How We Use Your Data',
            content: 'Your data is used solely to: (1) generate AI study content personalized to your materials, (2) power learning analytics, (3) enable collaboration features. We do not sell, rent, or share your data with third parties for advertising purposes.',
          },
          {
            icon: Server, title: 'Data Storage & Retention',
            content: 'All data is stored on encrypted servers (AES-256 at rest, TLS 1.3 in transit) hosted in the EU/US. Account data is retained as long as your account is active. After account deletion, all personal data is removed within 30 days.',
          },
          {
            icon: Download, title: 'Your Rights (GDPR)',
            content: 'Under GDPR, you have the right to: access your data (Article 15), correct inaccurate data (Article 16), delete your data — "right to be forgotten" (Article 17), export your data in a portable format (Article 20), and withdraw consent at any time.',
          },
          {
            icon: Globe, title: 'Third-Party Services',
            content: 'StudySnap+ uses Google Gemini API for AI processing under a data processing agreement that protects your data. Google does not use your content for training its models. We also use Vercel (hosting) and Cloudflare (CDN) — both compliant with GDPR.',
          },
          {
            icon: Shield, title: 'Children\'s Privacy',
            content: 'StudySnap+ is designed for users 13 and older. For users under 16 in the EU, we require parental consent per GDPR. We do not knowingly collect data from children under 13. If you believe a child has created an account, contact us immediately.',
          },
        ].map(({ icon: Icon, title, content }) => (
          <div key={title} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={15} color="#a78bfa" />
              </div>
              <h2 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{title}</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>{content}</p>
          </div>
        ))}

        <div style={{ padding: '1.25rem', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Contact Our Privacy Team</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            For privacy questions, data requests, or to report a concern: <strong style={{ color: '#a78bfa' }}>privacy@studysnap.ai</strong><br />
            Response time: Within 72 hours (GDPR Article 12 requires 30-day maximum for access requests).
          </p>
        </div>
      </div>
    </div>
  )
}
