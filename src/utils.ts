import type { Habit, TaskCategory } from './store'

export const TODAY = () => new Date().toISOString().slice(0, 10)

export function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

export function daysLeft(startDate: string, daysTotal: number) {
  const start = new Date(startDate)
  const end = new Date(start)
  end.setDate(end.getDate() + daysTotal)
  const diff = Math.ceil((end.getTime() - Date.now()) / 86400000)
  return Math.max(0, diff)
}

export function streakCount(completedDates: string[]): number {
  const sorted = [...completedDates].sort().reverse()
  if (!sorted.length) return 0
  let streak = 0
  let cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  for (const ds of sorted) {
    const d = new Date(ds)
    d.setHours(0, 0, 0, 0)
    const diff = Math.round((cursor.getTime() - d.getTime()) / 86400000)
    if (diff === 0 || diff === streak) {
      streak++
      cursor = d
    } else {
      break
    }
  }
  return streak
}

export function last7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })
}

export function isHabitScheduledToday(h: Habit): boolean {
  const dow = new Date().getDay()
  if (h.freq === 'daily') return true
  if (h.freq === 'weekdays') return dow >= 1 && dow <= 5
  if (h.freq === 'weekends') return dow === 0 || dow === 6
  if (h.freq === 'custom') return h.days?.includes(dow) ?? false
  return false
}

export const categoryColors: Record<TaskCategory, string> = {
  health: '#22c55e',
  work: '#3b82f6',
  kids: '#f97316',
  family: '#ec4899',
  study: '#f59e0b',
  personal: '#8b5cf6',
}

export const categoryLabels: Record<TaskCategory, string> = {
  health: 'Здоровье',
  work: 'Работа',
  kids: 'Дети',
  family: 'Семья',
  study: 'Учёба',
  personal: 'Личное',
}

export const goalCategoryColors: Record<string, string> = {
  education: '#3b82f6',
  health: '#22c55e',
  finance: '#f59e0b',
  personal: '#8b5cf6',
}

export const goalCategoryLabels: Record<string, string> = {
  education: 'Образование',
  health: 'Здоровье',
  finance: 'Финансы',
  personal: 'Личное',
}
