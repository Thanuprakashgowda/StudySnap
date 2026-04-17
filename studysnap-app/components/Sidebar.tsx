'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookOpen, LayoutDashboard, Upload, FileText, Brain, Zap,
  MessageSquare, BarChart3, Users, Settings, Shield, X,
  LogOut, Sun, Moon, Bell, ChevronRight
} from 'lucide-react'
import { useApp } from '@/lib/context'
import { getInitials } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/upload', label: 'Upload Material', icon: Upload },
  { href: '/notes', label: 'My Notes', icon: FileText },
  { href: '/quiz', label: 'Quizzes', icon: Brain },
  { href: '/flashcards', label: 'Flashcards', icon: Zap },
  { href: '/tutor', label: 'AI Tutor', icon: MessageSquare },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/collaborate', label: 'Collaborate', icon: Users },
]

const BOTTOM_NAV = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/admin', label: 'Admin & Privacy', icon: Shield },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, theme, toggleTheme, sidebarOpen, setSidebarOpen, logout, notifications } = useApp()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 39, backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={15} color="white" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>StudySnap<span style={{ color: '#7c3aed' }}>+</span></span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="btn btn-ghost btn-icon" style={{ display: 'none' }} id="sidebar-close" aria-label="Close sidebar">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Main Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0' }}>
          <div style={{ padding: '0 0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem' }}>Study Tools</span>
          </div>

          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`sidebar-link ${isActive(href) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}>
              <Icon size={16} />
              <span style={{ flex: 1 }}>{label}</span>
              {href === '/tutor' && (
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} title="Online" />
              )}
              {href === '/collaborate' && notifications > 0 && (
                <div className="badge badge-rose" style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>{notifications}</div>
              )}
            </Link>
          ))}

          <div style={{ height: 1, background: 'var(--border)', margin: '0.75rem 0.5rem' }} />

          <div style={{ padding: '0 0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem' }}>Account</span>
          </div>

          {BOTTOM_NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`sidebar-link ${isActive(href) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer — user card */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Theme toggle + notifications */}
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0 0.25rem' }}>
            <button onClick={toggleTheme} className="btn btn-ghost btn-icon" aria-label="Toggle theme" style={{ flex: 1, borderRadius: 8 }}>
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              <span style={{ fontSize: '0.75rem' }}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <div style={{ position: 'relative' }}>
              <button className="btn btn-ghost btn-icon" aria-label="Notifications">
                <Bell size={15} />
              </button>
              {notifications > 0 && <div className="notif-dot" />}
            </div>
          </div>

          {/* User info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'white', flexShrink: 0,
            }}>{user ? getInitials(user.name) : 'AJ'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Alex Johnson'}</div>
              <div className="badge badge-purple" style={{ marginTop: '0.1rem' }}>{user?.plan || 'pro'}</div>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost btn-icon" style={{ borderRadius: 8, flexShrink: 0 }} title="Log out">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
