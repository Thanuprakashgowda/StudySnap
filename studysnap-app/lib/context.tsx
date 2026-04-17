'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { User } from '@/types'
import { MOCK_USER } from '@/lib/data'

interface AppContextType {
  user: User | null
  theme: 'dark' | 'light'
  toggleTheme: () => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  notifications: number
}

const AppContext = createContext<AppContextType>({} as AppContextType)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [notifications] = useState(3)

  useEffect(() => {
    // Check saved theme
    const saved = localStorage.getItem('studysnap-theme') as 'dark' | 'light' | null
    if (saved) setTheme(saved)
    // Auto-login for demo
    const authed = localStorage.getItem('studysnap-authed')
    if (authed === 'true') {
      setUser(MOCK_USER)
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light')
    localStorage.setItem('studysnap-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }, [])

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800))
    if (email.includes('@')) {
      const u = { ...MOCK_USER, email }
      setUser(u)
      setIsAuthenticated(true)
      localStorage.setItem('studysnap-authed', 'true')
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('studysnap-authed')
  }, [])

  return (
    <AppContext.Provider value={{ user, theme, toggleTheme, sidebarOpen, setSidebarOpen, isAuthenticated, login, logout, notifications }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
