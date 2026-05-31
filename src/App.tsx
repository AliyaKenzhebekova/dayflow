import { useEffect, useState } from 'react'
import { useStore } from './store'
import { Dashboard } from './components/Dashboard'
import { Schedule } from './components/Schedule'
import { Habits } from './components/Habits'
import { Goals } from './components/Goals'
import { CalendarView } from './components/CalendarView'
import { MealPrep } from './components/MealPrep'
import { Reminders } from './components/Reminders'
import { Motivation } from './components/Motivation'
import {
  LayoutDashboard, Clock, Flame, Target, Calendar,
  UtensilsCrossed, Bell, Star, X
} from 'lucide-react'

type Tab = 'dashboard' | 'schedule' | 'habits' | 'goals' | 'calendar' | 'prep' | 'reminders' | 'motivation'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Дашборд', icon: <LayoutDashboard size={20} /> },
  { id: 'schedule', label: 'День', icon: <Clock size={20} /> },
  { id: 'habits', label: 'Привычки', icon: <Flame size={20} /> },
  { id: 'goals', label: 'Цели', icon: <Target size={20} /> },
  { id: 'calendar', label: 'Календарь', icon: <Calendar size={20} /> },
  { id: 'prep', label: 'Заготовки', icon: <UtensilsCrossed size={20} /> },
  { id: 'reminders', label: 'Напоминания', icon: <Bell size={20} /> },
  { id: 'motivation', label: 'Мотивация', icon: <Star size={20} /> },
]

const TAB_COLORS: Record<Tab, string> = {
  dashboard: '#6366f1',
  schedule: '#3b82f6',
  habits: '#f97316',
  goals: '#8b5cf6',
  calendar: '#06b6d4',
  prep: '#22c55e',
  reminders: '#ec4899',
  motivation: '#f59e0b',
}

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const { activeReminder, dismissReminder, reminders } = useStore()

  useEffect(() => {
    const check = () => {
      const now = new Date()
      const hhmm = now.toTimeString().slice(0, 5)
      const dow = now.getDay()
      const dayMap: Record<number, string> = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' }
      const dayStr = dayMap[dow]
      const r = reminders.find(r => {
        if (!r.enabled || r.time !== hhmm) return false
        if (r.days === 'daily') return true
        if (r.days === 'weekdays') return dow >= 1 && dow <= 5
        if (r.days === 'weekends') return dow === 0 || dow === 6
        return r.days.split(',').includes(dayStr)
      })
      if (r) useStore.getState().triggerReminder(r)
    }
    const iv = setInterval(check, 60000)
    return () => clearInterval(iv)
  }, [reminders])

  const currentColor = TAB_COLORS[tab]

  return (
    <div className="min-h-screen" style={{ background: '#f5f5f7' }}>
      {/* Header */}
      <header className="sticky top-0 z-30" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: currentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 14 }}>
              D
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>DayFlow</p>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
                {new Date().toLocaleDateString('ru', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>
            {new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </header>

      {/* Reminder banner */}
      {activeReminder && (
        <div style={{ position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 50, width: 'calc(100% - 32px)', maxWidth: 380 }}>
          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid #e5e7eb', padding: 16, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: currentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
              <Bell size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14, margin: '0 0 2px' }}>Напоминание</p>
              <p style={{ fontSize: 14, color: '#4b5563', margin: '0 0 2px' }}>{activeReminder.title}</p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{activeReminder.time}</p>
            </div>
            <button onClick={dismissReminder} style={{ color: '#d1d5db', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div style={{ display: 'none' }} className="lg-sidebar">
        {/* shown via CSS below */}
      </div>

      {/* Main */}
      <main style={{ maxWidth: 520, margin: '0 auto', padding: '16px 16px 100px' }}>
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'schedule' && <Schedule />}
        {tab === 'habits' && <Habits />}
        {tab === 'goals' && <Goals />}
        {tab === 'calendar' && <CalendarView />}
        {tab === 'prep' && <MealPrep />}
        {tab === 'reminders' && <Reminders />}
        {tab === 'motivation' && <Motivation />}
      </main>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid #e5e7eb',
        display: 'flex', overflowX: 'auto',
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '8px 12px', flexShrink: 0, border: 'none',
              background: 'none', cursor: 'pointer',
              color: tab === t.id ? TAB_COLORS[t.id] : '#9ca3af',
              minWidth: 56,
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: tab === t.id ? TAB_COLORS[t.id] + '20' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              {t.icon}
            </div>
            <span style={{ fontSize: 10, fontWeight: 500 }}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
