import { useState } from 'react'
import { useStore, type HabitFreq, type Habit } from '../store'
import { TODAY, streakCount, isHabitScheduledToday, last7Days } from '../utils'
import { Plus, Trash2, Flame, Pencil } from 'lucide-react'
import { EditModal } from './EditModal'

const FREQ_LABELS: Record<HabitFreq, string> = {
  daily: 'Ежедневно',
  weekdays: 'По будням',
  weekends: 'По выходным',
  custom: 'Своя частота',
}


export function Habits() {
  const { habits, toggleHabit, addHabit, updateHabit, deleteHabit } = useStore()
  const today = TODAY()
  const days7 = last7Days()
  const [showAdd, setShowAdd] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [form, setForm] = useState({ name: '', duration: '30', time: '07:00', freq: 'daily' as HabitFreq })

  const scheduled = habits.filter(isHabitScheduledToday)
  const other = habits.filter((h) => !isHabitScheduledToday(h))

  const handleAdd = () => {
    if (!form.name.trim()) return
    addHabit({ name: form.name, duration: Number(form.duration), time: form.time, freq: form.freq })
    setForm({ name: '', duration: '30', time: '07:00', freq: 'daily' })
    setShowAdd(false)
  }

  return (
    <div className="pb-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">Привычки</h2>
          <p className="text-sm text-gray-500">Сегодня: {scheduled.filter(h => h.completedDates.includes(today)).length}/{scheduled.length}</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
          style={{ background: '#6366f1' }}
        >
          <Plus size={20} />
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3 shadow-sm">
          <h3 className="font-semibold text-sm">Новая привычка</h3>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
            placeholder="Название"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <div className="flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
              placeholder="Время (07:00)"
              value={form.time}
              onChange={e => setForm({ ...form, time: e.target.value })}
            />
            <input
              className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
              placeholder="мин"
              type="number"
              value={form.duration}
              onChange={e => setForm({ ...form, duration: e.target.value })}
            />
          </div>
          <select
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
            value={form.freq}
            onChange={e => setForm({ ...form, freq: e.target.value as HabitFreq })}
          >
            {Object.entries(FREQ_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#6366f1' }}>
              Добавить
            </button>
            <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600">
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Today habits */}
      {scheduled.length > 0 && (
        <section>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">На сегодня</p>
          <div className="space-y-2">
            {scheduled.map((h) => <HabitCard key={h.id} habit={h} today={today} days7={days7} onToggle={() => toggleHabit(h.id, today)} onDelete={() => deleteHabit(h.id)} onEdit={() => setEditingHabit(h)} />)}
          </div>
        </section>
      )}

      {other.length > 0 && (
        <section>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Другие дни</p>
          <div className="space-y-2">
            {other.map((h) => <HabitCard key={h.id} habit={h} today={today} days7={days7} onToggle={() => toggleHabit(h.id, today)} onDelete={() => deleteHabit(h.id)} onEdit={() => setEditingHabit(h)} />)}
          </div>
        </section>
      )}
      {editingHabit && (
        <EditModal
          title="Редактировать привычку"
          accentColor="#f97316"
          fields={[
            { key: 'name', label: 'Название', type: 'text', placeholder: 'Медитация ходьбой' },
            { key: 'time', label: 'Время', type: 'time' },
            { key: 'duration', label: 'Длительность (мин)', type: 'number' },
            { key: 'freq', label: 'Частота', type: 'select', options: [
              { value: 'daily', label: 'Ежедневно' },
              { value: 'weekdays', label: 'По будням' },
              { value: 'weekends', label: 'По выходным' },
            ]},
          ]}
          values={{ name: editingHabit.name, time: editingHabit.time, duration: editingHabit.duration, freq: editingHabit.freq }}
          onSave={(v) => updateHabit(editingHabit.id, { name: String(v.name), time: String(v.time), duration: Number(v.duration), freq: v.freq as HabitFreq })}
          onClose={() => setEditingHabit(null)}
        />
      )}
    </div>
  )
}

function HabitCard({ habit, today, days7, onToggle, onDelete, onEdit }: {
  habit: import('../store').Habit
  today: string
  days7: string[]
  onToggle: () => void
  onDelete: () => void
  onEdit: () => void
}) {
  const done = habit.completedDates.includes(today)
  const streak = streakCount(habit.completedDates)
  const streakColor = streak >= 14 ? '#ef4444' : streak >= 7 ? '#f97316' : streak >= 3 ? '#22c55e' : '#9ca3af'

  return (
    <div
      className="bg-white rounded-2xl p-4 border border-gray-100"
      style={{ borderColor: done ? '#bbf7d0' : '#e5e7eb', background: done ? '#f0fdf4' : 'white' }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all text-sm font-bold flex-shrink-0"
          style={{ background: done ? '#22c55e' : '#f3f4f6', color: done ? 'white' : '#9ca3af' }}
        >
          {done ? '✓' : '○'}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{habit.name}</p>
            {streak > 0 && (
              <span className="flex items-center gap-0.5 text-xs font-bold" style={{ color: streakColor }}>
                {streak >= 7 ? <Flame size={12} /> : null}{streak}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">{habit.time} · {habit.duration} мин · {FREQ_LABELS[habit.freq]}</p>
        </div>
        <button onClick={onEdit} className="text-gray-300 hover:text-blue-400 transition-colors">
          <Pencil size={15} />
        </button>
        <button onClick={onDelete} className="text-gray-300 hover:text-red-400 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>

      {/* 7-day dots */}
      <div className="flex gap-1 mt-3">
        {days7.map((day) => {
          const c = habit.completedDates.includes(day)
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full h-1.5 rounded-full" style={{ background: c ? '#22c55e' : '#e5e7eb' }} />
              <span className="text-[9px] text-gray-300">
                {new Date(day + 'T12:00:00').toLocaleDateString('ru', { weekday: 'narrow' })}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
