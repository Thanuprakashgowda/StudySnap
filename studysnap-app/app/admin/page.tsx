'use client'
import React, { useState } from 'react'
import {
  Shield, Users, BarChart2, AlertTriangle, Check, Lock, Eye, FileText,
  TrendingUp, Server, Globe, Download
} from 'lucide-react'
import TopBar from '@/components/TopBar'

const MOCK_USERS_ADMIN = [
  { id: 'u1', name: 'Alex Johnson', email: 'alex@uni.edu', plan: 'pro', uploads: 4, lastActive: '2 hours ago', status: 'active' },
  { id: 'u2', name: 'Priya Sharma', email: 'priya@uni.edu', plan: 'free', uploads: 2, lastActive: '1 day ago', status: 'active' },
  { id: 'u3', name: 'Carlos Mendez', email: 'carlos@uni.edu', plan: 'pro', uploads: 7, lastActive: '3 hours ago', status: 'active' },
  { id: 'u4', name: 'Jung-ah Kim', email: 'jungah@uni.edu', plan: 'free', uploads: 1, lastActive: '2 days ago', status: 'inactive' },
]

const PLATFORM_STATS = [
  { label: 'Total Users', value: '12,483', icon: Users, color: '#7c3aed', change: '+142 this week' },
  { label: 'Materials Uploaded', value: '89,204', icon: FileText, color: '#3b82f6', change: '+1,203 today' },
  { label: 'AI Queries / Day', value: '34,102', icon: TrendingUp, color: '#10b981', change: '↑ 14% WoW' },
  { label: 'Avg Session (min)', value: '42.7', icon: BarChart2, color: '#f59e0b', change: 'Healthy engagement' },
]

const TABS = ['Users', 'Platform Stats', 'Privacy Controls', 'Content Moderation']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Users')

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      <TopBar
        title="Admin & Privacy"
        subtitle="Platform administration, GDPR compliance, and content moderation"
        actions={<span className="badge badge-rose" style={{ display: 'inline-flex' }}><Shield size={10} /> Admin Access</span>}
      />

      <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.3rem', borderRadius: 12, width: 'fit-content', border: '1px solid var(--border)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: '0.45rem 1rem', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 500, transition: 'all 0.2s', background: activeTab === t ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'transparent', color: activeTab === t ? 'white' : 'var(--text-secondary)' }}>
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'Users' && (
          <div>
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {PLATFORM_STATS.map(({ label, value, icon: Icon, color, change }) => (
                <div key={label} className="stat-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={color} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color, marginTop: '0.5rem' }}>{value}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-primary)', marginTop: '0.1rem' }}>{label}</div>
                  <div style={{ fontSize: '0.68rem', color: '#10b981' }}>{change}</div>
                </div>
              ))}
            </div>

            {/* User table */}
            <div className="card">
              <div className="section-header">
                <h3 className="section-title">All Users</h3>
                <button className="btn btn-secondary btn-sm"><Download size={13} /> Export CSV</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Name', 'Email', 'Plan', 'Uploads', 'Last Active', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 0.875rem', textAlign: 'left', fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_USERS_ADMIN.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-input)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '' }}>
                        <td style={{ padding: '0.875rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed55, #3b82f655)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700, border: '1px solid var(--border)' }}>
                              {u.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            {u.name}
                          </div>
                        </td>
                        <td style={{ padding: '0.875rem', color: 'var(--text-muted)' }}>{u.email}</td>
                        <td style={{ padding: '0.875rem' }}>
                          <span className={`badge ${u.plan === 'pro' ? 'badge-purple' : 'badge-blue'}`}>{u.plan}</span>
                        </td>
                        <td style={{ padding: '0.875rem', color: 'var(--text-secondary)' }}>{u.uploads}</td>
                        <td style={{ padding: '0.875rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.lastActive}</td>
                        <td style={{ padding: '0.875rem' }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.status === 'active' ? '#10b981' : '#6b7280', display: 'inline-block' }} />
                          <span style={{ marginLeft: '0.35rem', fontSize: '0.78rem', color: u.status === 'active' ? '#34d399' : 'var(--text-muted)', textTransform: 'capitalize' }}>{u.status}</span>
                        </td>
                        <td style={{ padding: '0.875rem' }}>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button className="btn btn-ghost btn-sm btn-icon" title="View"><Eye size={13} /></button>
                            <button className="btn btn-ghost btn-sm btn-icon" title="Suspend" style={{ color: 'var(--accent-rose)' }}><AlertTriangle size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Platform Stats' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {[
              { title: '💾 Storage Used', value: '2.8 TB', sub: '68% of capacity', bar: 68, color: '#7c3aed' },
              { title: '⚡ AI API Usage', value: '1.2M tokens/day', sub: '82% of quota', bar: 82, color: '#f59e0b' },
              { title: '🌐 CDN Requests', value: '8.4M / day', sub: 'p99: 245ms response', bar: 74, color: '#3b82f6' },
              { title: '🔒 Security Events', value: '0 incidents', sub: 'Last 30 days', bar: 0, color: '#10b981' },
            ].map(({ title, value, sub, bar, color }) => (
              <div key={title} className="card">
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{title}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color, marginBottom: '0.25rem' }}>{value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{sub}</div>
                {bar > 0 && <div className="progress-bar"><div className="progress-fill" style={{ width: `${bar}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} /></div>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Privacy Controls' && (
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>GDPR & Privacy Compliance</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              StudySnap+ is fully GDPR-compliant. Manage data retention, deletion requests, and platform-wide privacy policies.
            </p>
            {[
              { title: 'Data Retention Policy', desc: 'User data is retained for 30 days after account deletion. AI chat logs are anonymized after 90 days.', status: 'Compliant', icon: Lock },
              { title: 'Deletion Requests', desc: '2 pending deletion requests. Process within 30 days per GDPR Article 17.', status: '2 Pending', icon: AlertTriangle },
              { title: 'Data Export Requests', desc: 'Users can download all their data in JSON format. Average processing: <2 hours.', status: 'Active', icon: Download },
              { title: 'Third-party Sharing', desc: 'No user data is shared with third parties for advertising. AI processing uses Gemini API under data processing agreement.', status: 'Secure', icon: Globe },
              { title: 'Encryption at Rest', desc: 'All uploaded materials and notes are encrypted at rest using AES-256.', status: 'Active', icon: Shield },
            ].map(({ title, desc, status, icon: Icon }) => (
              <div key={title} style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: '0.75rem', display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color="#10b981" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{title}</div>
                    <span className={`badge ${status === 'Compliant' || status === 'Active' || status === 'Secure' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                      {status === 'Compliant' || status === 'Active' || status === 'Secure' ? <Check size={9} /> : <AlertTriangle size={9} />} {status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Content Moderation' && (
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Content Moderation Queue</h3>
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Shield size={48} style={{ opacity: 0.3, marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
              <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>No items in queue</div>
              <div style={{ fontSize: '0.85rem' }}>All reported content has been reviewed. Your platform is clean! 🎉</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
