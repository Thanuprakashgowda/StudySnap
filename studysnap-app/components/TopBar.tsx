'use client'
import React from 'react'
import { Menu, Search, Bell } from 'lucide-react'
import { useApp } from '@/lib/context'

interface TopBarProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { setSidebarOpen, notifications } = useApp()

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)',
      padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
      backdropFilter: 'blur(8px)',
    }}>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="btn btn-ghost btn-icon"
        aria-label="Open menu"
        style={{ display: 'none', flexShrink: 0 }}
        id="mobile-menu-btn"
      >
        <Menu size={18} />
      </button>

      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {actions}
        <div style={{ position: 'relative' }}>
          <button className="btn btn-ghost btn-icon" aria-label="Notifications">
            <Bell size={17} />
          </button>
          {notifications > 0 && <div className="notif-dot" />}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
