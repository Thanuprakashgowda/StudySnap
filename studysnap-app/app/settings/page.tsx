'use client'
import React, { useState } from 'react'
import {
  User, Lock, Globe, Bell, Download, Trash2, Moon, Sun, Eye,
  Shield, AlertTriangle, Save, ChevronRight, Check
} from 'lucide-react'
import TopBar from '@/components/TopBar'
import { MOCK_USER } from '@/lib/data'
import { LANGUAGES, SUBJECTS } from '@/lib/utils'
import { useApp } from '@/lib/context'

const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'appearance', label: 'Appearance', icon: Moon },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'privacy', label: 'Privacy & Data', icon: Shield },
  { key: 'export', label: 'Export & Delete', icon: Download },
]

export default function SettingsPage() {
  const { theme, toggleTheme } = useApp()
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [settings, setSettings] = useState({
    name: MOCK_USER.name,
    email: MOCK_USER.email,
    language: 'en',
    subject: 'Biology',
    exportFormat: 'pdf',
    notifications: true,
    emailDigest: true,
    autoTranscribe: true,
    highContrast: false,
    fontSize: 'md',
    reduceMotion: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <div onClick={onChange} style={{
      width: 40, height: 22, borderRadius: 11,
      background: value ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'var(--border)',
      position: 'relative', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
    }}>
      <div style={{ position: 'absolute', top: 3, left: value ? 20 : 3, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }} />
    </div>
  )

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      <TopBar
        title="Settings"
        subtitle="Manage your account, preferences, and data"
        actions={
          <button onClick={handleSave} className="btn btn-primary btn-sm">
            {saved ? <><Check size={13} /> Saved!</> : <><Save size={13} /> Save Changes</>}
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', padding: '1.5rem', gap: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
        {/* Tab nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.875rem',
                borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem',
                background: activeTab === key ? 'rgba(124,58,237,0.12)' : 'transparent',
                color: activeTab === key ? 'var(--accent-purple-light)' : 'var(--text-secondary)',
                transition: 'all 0.15s', textAlign: 'left', width: '100%',
              }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="card" style={{ animation: 'fadeIn 0.2s ease' }}>
          {activeTab === 'profile' && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Profile Information</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Full Name</label>
                  <input className="input" value={settings.name} onChange={e => setSettings(s => ({ ...s, name: e.target.value }))} />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Email Address</label>
                  <input className="input" type="email" value={settings.email} onChange={e => setSettings(s => ({ ...s, email: e.target.value }))} />
                </div>
              </div>
              <div className="divider" />
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Preferred Language</label>
                  <select className="input" value={settings.language} onChange={e => setSettings(s => ({ ...s, language: e.target.value }))}>
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Default Subject</label>
                  <select className="input" value={settings.subject} onChange={e => setSettings(s => ({ ...s, subject: e.target.value }))}>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="divider" />
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Password</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input className="input" type="password" placeholder="Current password" style={{ flex: 1 }} />
                  <input className="input" type="password" placeholder="New password" style={{ flex: 1 }} />
                  <button className="btn btn-secondary"><Lock size={14} /> Update</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Appearance & Accessibility</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                {[{ mode: 'dark', label: 'Dark', icon: Moon }, { mode: 'light', label: 'Light', icon: Sun }].map(({ mode, label, icon: Icon }) => (
                  <div key={mode} onClick={() => { if (theme !== mode) toggleTheme() }}
                    style={{ flex: 1, padding: '1.25rem', borderRadius: 12, border: `2px solid ${theme === mode ? '#7c3aed' : 'var(--border)'}`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', background: theme === mode ? 'rgba(124,58,237,0.08)' : 'var(--bg-input)' }}>
                    <Icon size={22} style={{ marginBottom: '0.5rem', color: theme === mode ? '#a78bfa' : 'var(--text-muted)' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: theme === mode ? 'var(--accent-purple-light)' : 'var(--text-secondary)' }}>{label}</div>
                  </div>
                ))}
              </div>
              <div className="divider" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { key: 'highContrast', label: 'High Contrast Mode', desc: 'Increases text contrast for readability' },
                  { key: 'reduceMotion', label: 'Reduce Motion', desc: 'Minimizes animations for accessibility' },
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem', background: 'var(--bg-input)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{desc}</div>
                    </div>
                    <Toggle value={settings[key as keyof typeof settings] as boolean} onChange={() => setSettings(s => ({ ...s, [key]: !s[key as keyof typeof s] }))} />
                  </div>
                ))}
                <div style={{ padding: '0.875rem', background: 'var(--bg-input)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Font Size</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['sm', 'md', 'lg'].map(size => (
                      <button key={size} onClick={() => setSettings(s => ({ ...s, fontSize: size }))}
                        style={{ flex: 1, padding: '0.4rem', borderRadius: 8, border: `1px solid ${settings.fontSize === size ? '#7c3aed' : 'var(--border)'}`, background: settings.fontSize === size ? 'rgba(124,58,237,0.1)' : 'var(--bg-card)', cursor: 'pointer', fontSize: '0.83rem', color: settings.fontSize === size ? 'var(--accent-purple-light)' : 'var(--text-secondary)', fontWeight: settings.fontSize === size ? 700 : 400 }}>
                        {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Notification Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {[
                  { key: 'notifications', label: 'Push Notifications', desc: 'Study reminders, quiz results, and collaboration updates' },
                  { key: 'emailDigest', label: 'Weekly Email Digest', desc: 'Summary of your progress and upcoming review sessions' },
                  { key: 'autoTranscribe', label: 'Auto-transcription Alerts', desc: 'Notify when your uploaded materials are ready to study' },
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{desc}</div>
                    </div>
                    <Toggle value={settings[key as keyof typeof settings] as boolean} onChange={() => setSettings(s => ({ ...s, [key]: !s[key as keyof typeof s] }))} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Privacy & Data</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Control how your data is used and stored. GDPR compliant.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {[
                  { title: '📊 Analytics Collection', desc: 'We collect anonymized learning analytics to improve recommendations. You can opt out at any time.', value: true },
                  { title: '🤝 Collaboration Visibility', desc: 'Allow workspace members to see your study progress and activity status (online/offline).', value: true },
                  { title: '🌐 Public Profile', desc: 'Make your study materials and notes discoverable by other students in your institution.', value: false },
                ].map(({ title, desc, value }) => (
                  <div key={title} style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{desc}</div>
                    </div>
                    <Toggle value={value} onChange={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Export & Delete Your Data</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                You have the right to access and delete all your data at any time. We&apos;ll never hold your data hostage.
              </p>

              {/* Export format */}
              <div style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Export Format</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {['pdf', 'docx', 'md'].map(fmt => (
                    <button key={fmt} onClick={() => setSettings(s => ({ ...s, exportFormat: fmt }))}
                      style={{ padding: '0.4rem 0.875rem', borderRadius: 8, border: `1px solid ${settings.exportFormat === fmt ? '#7c3aed' : 'var(--border)'}`, background: settings.exportFormat === fmt ? 'rgba(124,58,237,0.1)' : 'var(--bg-card)', cursor: 'pointer', fontSize: '0.83rem', color: settings.exportFormat === fmt ? 'var(--accent-purple-light)' : 'var(--text-secondary)', fontWeight: settings.exportFormat === fmt ? 700 : 400, textTransform: 'uppercase' }}>
                      .{fmt}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {[
                    { label: '📄 Export All Notes', desc: `${MOCK_USER.settings.exportFormat.toUpperCase()} format` },
                    { label: '🧠 Export Quiz Data', desc: 'CSV format' },
                    { label: '⚡ Export Flashcards', desc: 'Anki-compatible .apkg' },
                    { label: '📊 Export Analytics', desc: 'JSON/CSV format' },
                  ].map(({ label, desc }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', background: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--border)', flex: 1, minWidth: 200, cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#7c3aed' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{label}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{desc}</div>
                      </div>
                      <Download size={15} color="var(--text-muted)" />
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary" style={{ marginTop: '0.875rem' }}>
                  <Download size={15} /> Download All Data (.zip)
                </button>
              </div>

              {/* Danger zone */}
              <div style={{ padding: '1.25rem', background: 'rgba(244,63,94,0.06)', borderRadius: 12, border: '1px solid rgba(244,63,94,0.25)' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={16} color="#f43f5e" />
                  <div style={{ fontWeight: 700, color: '#fb7185' }}>Danger Zone</div>
                </div>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Permanently delete your account and all associated data. This action <strong>cannot be undone</strong>. Your data will be completely removed within 30 days.
                </p>
                {!showDeleteConfirm ? (
                  <button onClick={() => setShowDeleteConfirm(true)} style={{ padding: '0.6rem 1.25rem', background: 'transparent', border: '1px solid rgba(244,63,94,0.5)', borderRadius: 10, cursor: 'pointer', color: '#fb7185', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.1)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                    <Trash2 size={14} /> Delete My Account
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.875rem', color: '#fb7185', fontWeight: 600 }}>Are you sure? This cannot be undone.</span>
                    <button style={{ padding: '0.5rem 1rem', background: '#f43f5e', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'white', fontWeight: 600, fontSize: '0.83rem' }}>
                      Yes, Delete Everything
                    </button>
                    <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary btn-sm">Cancel</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
