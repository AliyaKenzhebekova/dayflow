import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Types ──────────────────────────────────────────────────────────────────

export type HabitFreq = 'daily' | 'weekdays' | 'weekends' | 'custom'

export interface Habit {
  id: string
  name: string
  duration: number
  time: string
  freq: HabitFreq
  days?: number[]
  completedDates: string[]
}

export type GoalCategory = 'education' | 'health' | 'finance' | 'personal'

export interface Goal {
  id: string
  name: string
  category: GoalCategory
  daysTotal: number
  startDate: string
  progress: number
}

export interface CalendarTask {
  id: string
  title: string
  date: string
  time?: string
  category: TaskCategory
  done: boolean
}

export type TaskCategory = 'health' | 'work' | 'kids' | 'family' | 'study' | 'personal'

export interface PrepItem {
  id: string
  name: string
  portions: number
  done: boolean
}

export interface Reminder {
  id: string
  title: string
  time: string
  days: string
  enabled: boolean
  category: TaskCategory
}

export interface Achievement {
  id: string
  title: string
  date: string
  icon: string
}

export type ScheduleType = 'rest' | 'habit' | 'work' | 'kids' | 'family' | 'food' | 'study' | 'goals' | 'personal'

export interface CustomBlock {
  id: string
  time: string
  label: string
  type: ScheduleType
  note?: string
  done: boolean
  date: string // YYYY-MM-DD (daily plan date)
}

export interface ScheduleNote {
  blockKey: string // e.g. "06:40-weekday"
  note: string
}

// ── Initial Data ───────────────────────────────────────────────────────────

const d = (offset: number) => {
  const dt = new Date()
  dt.setDate(dt.getDate() - offset)
  return dt.toISOString().slice(0, 10)
}

const initHabits: Habit[] = [
  { id: 'h1', name: 'Медитация ходьбой', duration: 40, time: '06:40', freq: 'daily', completedDates: [d(1), d(2), d(3)] },
  { id: 'h2', name: 'Йога', duration: 30, time: '07:30', freq: 'custom', days: [1, 3, 5], completedDates: [d(2)] },
  { id: 'h3', name: 'Чтение', duration: 30, time: '21:30', freq: 'daily', completedDates: [d(1), d(2)] },
  { id: 'h4', name: 'Дневник благодарности', duration: 10, time: '22:00', freq: 'daily', completedDates: [d(1), d(2), d(3), d(4)] },
  { id: 'h5', name: 'Английский язык', duration: 45, time: '17:30', freq: 'daily', completedDates: [d(1), d(2), d(3), d(4), d(5)] },
]

const initGoals: Goal[] = [
  { id: 'g1', name: 'Английский до B2', category: 'education', daysTotal: 365, startDate: d(30), progress: 8 },
  { id: 'g2', name: '2 книги в месяц', category: 'education', daysTotal: 365, startDate: d(30), progress: 20 },
  { id: 'g3', name: 'Полное обследование', category: 'health', daysTotal: 92, startDate: d(10), progress: 15 },
  { id: 'g4', name: 'Доход 5 млн ₽/мес', category: 'finance', daysTotal: 365, startDate: d(30), progress: 5 },
  { id: 'g5', name: 'Режим и дисциплина', category: 'personal', daysTotal: 180, startDate: d(30), progress: 30 },
]

const initCalendarTasks: CalendarTask[] = [
  { id: 'ct1', title: 'Терапевт', date: new Date().toISOString().slice(0, 10), time: '10:00', category: 'health', done: false },
  { id: 'ct2', title: 'Общий анализ крови', date: d(-7), time: '09:00', category: 'health', done: false },
  { id: 'ct3', title: 'УЗИ органов', date: d(-14), time: '11:00', category: 'health', done: false },
  { id: 'ct4', title: 'Кардиолог', date: d(-21), time: '14:00', category: 'health', done: false },
  { id: 'ct5', title: 'День рождения Ани', date: d(-10), category: 'family', done: false },
  { id: 'ct6', title: 'Собрание в школе', date: d(-5), time: '18:00', category: 'kids', done: false },
]

const initPrepItems: PrepItem[] = [
  { id: 'p1', name: 'Борщ (кастрюля 6 л)', portions: 8, done: false },
  { id: 'p2', name: 'Запечённая курица', portions: 10, done: false },
  { id: 'p3', name: 'Гречка отварная', portions: 6, done: false },
  { id: 'p4', name: 'Рис отварной', portions: 6, done: false },
  { id: 'p5', name: 'Котлеты (заморозка)', portions: 20, done: false },
  { id: 'p6', name: 'Овощная нарезка (заморозка)', portions: 4, done: false },
  { id: 'p7', name: 'Компот для детей (3 л)', portions: 6, done: false },
  { id: 'p8', name: 'Салат из свежих овощей', portions: 4, done: false },
]

const initReminders: Reminder[] = [
  { id: 'r1', title: 'Медитация ходьбой', time: '06:40', days: 'daily', enabled: true, category: 'personal' },
  { id: 'r2', title: 'Йога', time: '07:30', days: 'Mon,Wed,Fri', enabled: true, category: 'personal' },
  { id: 'r3', title: 'Английский язык', time: '17:30', days: 'daily', enabled: true, category: 'study' },
  { id: 'r4', title: 'Чтение', time: '21:30', days: 'daily', enabled: true, category: 'personal' },
  { id: 'r5', title: 'Дневник благодарности', time: '22:00', days: 'daily', enabled: true, category: 'personal' },
  { id: 'r6', title: 'Забрать детей из школы', time: '13:00', days: 'weekdays', enabled: true, category: 'kids' },
  { id: 'r7', title: 'Время с младшими детьми', time: '16:30', days: 'daily', enabled: true, category: 'kids' },
  { id: 'r8', title: 'Ужин для всей семьи', time: '18:30', days: 'daily', enabled: true, category: 'family' },
  { id: 'r9', title: 'Разговор со старшими детьми', time: '20:00', days: 'daily', enabled: false, category: 'family' },
  { id: 'r10', title: 'Составить список продуктов', time: '17:00', days: 'Sat', enabled: true, category: 'personal' },
  { id: 'r11', title: 'Старт заготовок', time: '17:00', days: 'Sun', enabled: true, category: 'personal' },
  { id: 'r12', title: 'Разморозить мясо', time: '18:00', days: 'Sun', enabled: true, category: 'personal' },
  { id: 'r13', title: 'Проверить запасы', time: '20:00', days: 'Sun', enabled: false, category: 'personal' },
  { id: 'r14', title: 'Проверить запись к врачу', time: '09:00', days: 'Mon', enabled: true, category: 'health' },
  { id: 'r15', title: 'Выпить витамины', time: '08:30', days: 'daily', enabled: true, category: 'health' },
]

const initAchievements: Achievement[] = [
  { id: 'a1', title: 'Первая неделя без пропусков', date: d(5), icon: '🏆' },
  { id: 'a2', title: '5 дней английского подряд', date: d(3), icon: '🔥' },
  { id: 'a3', title: 'Заготовки выполнены полностью', date: d(8), icon: '🍱' },
]

// ── Store ──────────────────────────────────────────────────────────────────

interface AppState {
  habits: Habit[]
  goals: Goal[]
  calendarTasks: CalendarTask[]
  prepItems: PrepItem[]
  reminders: Reminder[]
  achievements: Achievement[]
  activeReminder: Reminder | null
  customBlocks: CustomBlock[]
  scheduleNotes: ScheduleNote[]

  // Habits
  toggleHabit: (id: string, date: string) => void
  addHabit: (h: Omit<Habit, 'id' | 'completedDates'>) => void
  deleteHabit: (id: string) => void

  // Goals
  updateGoalProgress: (id: string, delta: number) => void
  addGoal: (g: Omit<Goal, 'id'>) => void
  deleteGoal: (id: string) => void

  // Calendar
  addCalendarTask: (t: Omit<CalendarTask, 'id'>) => void
  toggleCalendarTask: (id: string) => void
  deleteCalendarTask: (id: string) => void

  // Prep
  togglePrepItem: (id: string) => void
  addPrepItem: (name: string, portions: number) => void
  resetPrep: () => void

  // Reminders
  toggleReminder: (id: string) => void
  dismissReminder: () => void
  triggerReminder: (r: Reminder) => void

  // Achievements
  addAchievement: (title: string, icon: string) => void

  // Custom day blocks
  addCustomBlock: (b: Omit<CustomBlock, 'id'>) => void
  toggleCustomBlock: (id: string) => void
  deleteCustomBlock: (id: string) => void

  // Schedule notes
  setScheduleNote: (blockKey: string, note: string) => void
}

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      habits: initHabits,
      goals: initGoals,
      calendarTasks: initCalendarTasks,
      prepItems: initPrepItems,
      reminders: initReminders,
      achievements: initAchievements,
      activeReminder: null,
      customBlocks: [],
      scheduleNotes: [],

      toggleHabit: (id, date) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id
              ? { ...h, completedDates: h.completedDates.includes(date) ? h.completedDates.filter((d) => d !== date) : [...h.completedDates, date] }
              : h
          ),
        })),

      addHabit: (h) => set((s) => ({ habits: [...s.habits, { ...h, id: uid(), completedDates: [] }] })),
      deleteHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),

      updateGoalProgress: (id, delta) =>
        set((s) => ({
          goals: s.goals.map((g) => g.id === id ? { ...g, progress: Math.min(100, Math.max(0, g.progress + delta)) } : g),
        })),

      addGoal: (g) => set((s) => ({ goals: [...s.goals, { ...g, id: uid() }] })),
      deleteGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      addCalendarTask: (t) => set((s) => ({ calendarTasks: [...s.calendarTasks, { ...t, id: uid() }] })),
      toggleCalendarTask: (id) =>
        set((s) => ({ calendarTasks: s.calendarTasks.map((t) => t.id === id ? { ...t, done: !t.done } : t) })),
      deleteCalendarTask: (id) => set((s) => ({ calendarTasks: s.calendarTasks.filter((t) => t.id !== id) })),

      togglePrepItem: (id) =>
        set((s) => ({ prepItems: s.prepItems.map((p) => p.id === id ? { ...p, done: !p.done } : p) })),
      addPrepItem: (name, portions) =>
        set((s) => ({ prepItems: [...s.prepItems, { id: uid(), name, portions, done: false }] })),
      resetPrep: () => set((s) => ({ prepItems: s.prepItems.map((p) => ({ ...p, done: false })) })),

      toggleReminder: (id) =>
        set((s) => ({ reminders: s.reminders.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r) })),
      dismissReminder: () => set({ activeReminder: null }),
      triggerReminder: (r) => set({ activeReminder: r }),

      addAchievement: (title, icon) =>
        set((s) => ({
          achievements: [{ id: uid(), title, date: new Date().toISOString().slice(0, 10), icon }, ...s.achievements],
        })),

      addCustomBlock: (b) => set((s) => ({ customBlocks: [...s.customBlocks, { ...b, id: uid() }] })),
      toggleCustomBlock: (id) =>
        set((s) => ({ customBlocks: s.customBlocks.map((b) => b.id === id ? { ...b, done: !b.done } : b) })),
      deleteCustomBlock: (id) => set((s) => ({ customBlocks: s.customBlocks.filter((b) => b.id !== id) })),

      setScheduleNote: (blockKey, note) =>
        set((s) => {
          const existing = s.scheduleNotes.find((n) => n.blockKey === blockKey)
          if (existing) {
            return { scheduleNotes: s.scheduleNotes.map((n) => n.blockKey === blockKey ? { ...n, note } : n) }
          }
          return { scheduleNotes: [...s.scheduleNotes, { blockKey, note }] }
        }),
    }),
    { name: 'dayflow-v2' }
  )
)
