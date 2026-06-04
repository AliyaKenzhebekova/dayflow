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
import { Books } from './components/Books'
import { AddPlanModal } from './components/AddPlanModal'
import {
  LayoutDashboard, Clock, Flame, Target, Calendar,
  UtensilsCrossed, Bell, Star, X, Plus, BookOpen
} from 'lucide-react'

type Tab = 'dashboard' | 'schedule' | 'habits' | 'goals' | 'calendar' | 'prep' | 'reminders' | 'motivation' | 'books'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',  label: 'Дашборд',    icon: <LayoutDashboard size={20} /> },
  { id: 'schedule',   label: 'День',        icon: <Clock size={20} /> },
  { id: 'habits',     label: 'Привычки',    icon: <Flame size={20} /> },
  { id: 'goals',      label: 'Цели',        icon: <Target size={20} /> },
  { id: 'calendar',   label: 'Календарь',   icon: <Calendar size={20} /> },
  { id: 'prep',       label: 'Заготовки',   icon: <UtensilsCrossed size={20} /> },
  { id: 'reminders',  label: 'Напоминания', icon: <Bell size={20} /> },
  { id: 'motivation', label: 'Мотивация',   icon: <Star size={20} /> },
  { id: 'books',      label: 'Книги',        icon: <BookOpen size={20} /> },
]

const TAB_COLORS: Record<Tab, string> = {
  dashboard:  '#6366f1',
  schedule:   '#3b82f6',
  habits:     '#f97316',
  goals:      '#8b5cf6',
  calendar:   '#06b6d4',
  prep:       '#22c55e',
  reminders:  '#ec4899',
  motivation: '#f59e0b',
  books:      '#d97706',
}

const VALID_TABS = TABS.map(t => t.id)

export default function App() {
  const hashTab = window.location.hash.slice(1) as Tab
  const [tab, setTab] = useState<Tab>(VALID_TABS.includes(hashTab) ? hashTab : 'dashboard')
  const [showAddPlan, setShowAddPlan] = useState(false)
  const { activeReminder, dismissReminder, reminders } = useStore()

  const navigate = (t: Tab) => {
    setTab(t)
    window.location.hash = t
  }

  useEffect(() => {
    const check = () => {
      const now = new Date()
      const hhmm = now.toTimeString().slice(0, 5)
      const dow = now.getDay()
      const dayMap: Record<number, string> = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' }
      const r = reminders.find(r => {
        if (!r.enabled || r.time !== hhmm) return false
        if (r.days === 'daily') return true
        if (r.days === 'weekdays') return dow >= 1 && dow <= 5
        if (r.days === 'weekends') return dow === 0 || dow === 6
        return r.days.split(',').includes(dayMap[dow])
      })
      if (r) useStore.getState().triggerReminder(r)
    }
    const iv = setInterval(check, 60000)
    return () => clearInterval(iv)
  }, [reminders])

  const color = TAB_COLORS[tab]

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 11, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 15, transition: 'background 0.3s' }}>
              D
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, margin: 0, lineHeight: 1.2 }}>DayFlow</p>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
                {new Date().toLocaleDateString('ru', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>
              {new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {/* Quick add button in header */}
            <button onClick={() => setShowAddPlan(true)}
              style={{ width: 32, height: 32, borderRadius: 10, background: color + '18', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color, transition: 'background 0.3s' }}>
              <Plus size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Reminder banner */}
      {activeReminder && (
        <div style={{ position: 'fixed', top: 68, left: '50%', transform: 'translateX(-50%)', zIndex: 50, width: 'calc(100% - 32px)', maxWidth: 380 }}>
          <div style={{ background: 'white', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.14)', border: '1px solid #e5e7eb', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
              <Bell size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14, margin: '0 0 2px' }}>Напоминание</p>
              <p style={{ fontSize: 13, color: '#4b5563', margin: 0 }}>{activeReminder.title} · {activeReminder.time}</p>
            </div>
            <button onClick={dismissReminder} style={{ color: '#d1d5db', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{ maxWidth: 520, margin: '0 auto', padding: '16px 16px 110px' }}>
        {tab === 'dashboard'  && <Dashboard onNavigate={navigate} />}
        {tab === 'schedule'   && <Schedule onAddPlan={() => setShowAddPlan(true)} />}
        {tab === 'habits'     && <Habits />}
        {tab === 'goals'      && <Goals />}
        {tab === 'calendar'   && <CalendarView />}
        {tab === 'prep'       && <MealPrep />}
        {tab === 'reminders'  && <Reminders />}
        {tab === 'motivation' && <Motivation />}
        {tab === 'books'      && <Books />}
      </main>

      {/* Floating Add button (всегда видна) */}
      <button
        onClick={() => setShowAddPlan(true)}
        style={{
          position: 'fixed', bottom: 86, right: 20, zIndex: 25,
          width: 52, height: 52, borderRadius: 16,
          background: color, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', boxShadow: `0 4px 20px ${color}60`,
          transition: 'all 0.3s',
        }}
        title="Добавить план на сегодня"
      >
        <Plus size={24} />
      </button>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid #e5e7eb',
        display: 'flex', overflowX: 'auto',
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => navigate(t.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '8px 10px', flexShrink: 0, border: 'none',
              background: 'none', cursor: 'pointer',
              color: tab === t.id ? TAB_COLORS[t.id] : '#9ca3af',
              minWidth: 52, flex: 1,
              transition: 'color 0.2s',
            }}>
            <div style={{
              width: 34, height: 34, borderRadius: 11,
              background: tab === t.id ? TAB_COLORS[t.id] + '18' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}>
              {t.icon}
            </div>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.2 }}>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Add Plan Modal */}
      {showAddPlan && <AddPlanModal onClose={() => setShowAddPlan(false)} />}
    </div>
  )
}
