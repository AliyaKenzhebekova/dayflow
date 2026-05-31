import { useState } from 'react'
import { useStore, type ScheduleType } from '../store'
import { X, Plus } from 'lucide-react'

const TYPES: { value: ScheduleType; label: string; emoji: string; color: string }[] = [
  { value: 'work',     label: 'Работа',   emoji: '💼', color: '#3b82f6' },
  { value: 'personal', label: 'Личное',   emoji: '💜', color: '#a855f7' },
  { value: 'health',   label: 'Здоровье', emoji: '💚', color: '#22c55e' },
  { value: 'kids',     label: 'Дети',     emoji: '👧', color: '#f97316' },
  { value: 'family',   label: 'Семья',    emoji: '❤️', color: '#ec4899' },
  { value: 'study',    label: 'Учёба',    emoji: '📚', color: '#f59e0b' },
  { value: 'goals',    label: 'Цели',     emoji: '🎯', color: '#8b5cf6' },
  { value: 'food',     label: 'Еда',      emoji: '🍱', color: '#86efac' },
  { value: 'rest',     label: 'Отдых',    emoji: '😴', color: '#9ca3af' },
]

interface Props {
  onClose: () => void
}

export function AddPlanModal({ onClose }: Props) {
  const { addCustomBlock } = useStore()
  const today = new Date().toISOString().slice(0, 10)
  const now = new Date().toTimeString().slice(0, 5)

  const [form, setForm] = useState({
    time: now,
    label: '',
    type: 'personal' as ScheduleType,
    note: '',
  })

  const handleAdd = () => {
    if (!form.label.trim()) return
    addCustomBlock({ ...form, done: false, date: today })
    onClose()
  }

  const selectedType = TYPES.find(t => t.value === form.type)!

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl p-5 space-y-4"
        style={{ background: 'white' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-1" />

        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">Новый план на сегодня</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <X size={16} />
          </button>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Что планируешь?</label>
          <input
            autoFocus
            className="w-full border-2 border-gray-100 focus:border-indigo-300 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            placeholder="Например: Позвонить маме, Сходить в аптеку..."
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
        </div>

        {/* Time */}
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Время</label>
          <input
            type="time"
            className="w-full border-2 border-gray-100 focus:border-indigo-300 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
        </div>

        {/* Type */}
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Категория</label>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setForm({ ...form, type: t.value })}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all"
                style={{
                  borderColor: form.type === t.value ? t.color : '#f3f4f6',
                  background: form.type === t.value ? t.color + '15' : '#f9fafb',
                  color: form.type === t.value ? t.color : '#6b7280',
                }}
              >
                <span>{t.emoji}</span>
                <span className="truncate">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Заметка (необязательно)</label>
          <textarea
            rows={2}
            className="w-full border-2 border-gray-100 focus:border-indigo-300 rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors"
            placeholder="Детали, напоминания..."
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleAdd}
          disabled={!form.label.trim()}
          className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          style={{ background: selectedType.color }}
        >
          <Plus size={20} /> {selectedType.emoji} Добавить в расписание
        </button>
      </div>
    </div>
  )
}
