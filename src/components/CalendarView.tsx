import { useState } from 'react'
import { useStore, type TaskCategory, type CalendarTask } from '../store'
import { categoryColors, categoryLabels } from '../utils'
import { ChevronLeft, ChevronRight, Plus, Trash2, Check, Pencil } from 'lucide-react'
import { EditModal } from './EditModal'

export function CalendarView() {
  const { calendarTasks, addCalendarTask, toggleCalendarTask, updateCalendarTask, deleteCalendarTask } = useStore()
  const [editingTask, setEditingTask] = useState<CalendarTask | null>(null)
  const [current, setCurrent] = useState(new Date())
  const [selected, setSelected] = useState<string | null>(new Date().toISOString().slice(0, 10))
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', time: '', category: 'personal' as TaskCategory })

  const year = current.getFullYear()
  const month = current.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = current.toLocaleDateString('ru', { month: 'long', year: 'numeric' })

  const isoDate = (d: number) => {
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    return `${year}-${mm}-${dd}`
  }

  const tasksForDay = (iso: string) => calendarTasks.filter((t) => t.date === iso)

  const selectedTasks = selected ? tasksForDay(selected) : []

  const handleAdd = () => {
    if (!form.title.trim() || !selected) return
    addCalendarTask({ title: form.title, date: selected, time: form.time, category: form.category, done: false })
    setForm({ title: '', time: '', category: 'personal' })
    setShowAdd(false)
  }

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1))
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="pb-6 space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft size={18} />
        </button>
        <h2 className="font-bold text-base capitalize">{monthName}</h2>
        <button onClick={nextMonth} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {['Вс','Пн','Вт','Ср','Чт','Пт','Сб'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const iso = isoDate(day)
          const tasks = tasksForDay(iso)
          const isToday = iso === today
          const isSelected = iso === selected
          const cats = [...new Set(tasks.map(t => t.category))]
          return (
            <button
              key={day}
              onClick={() => setSelected(iso)}
              className="relative flex flex-col items-center py-1.5 rounded-xl transition-all"
              style={{
                background: isSelected ? '#6366f1' : isToday ? '#e0e7ff' : 'transparent',
                color: isSelected ? 'white' : isToday ? '#4338ca' : '#374151',
              }}
            >
              <span className="text-sm font-medium">{day}</span>
              {cats.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {cats.slice(0, 3).map(c => (
                    <div key={c} className="w-1.5 h-1.5 rounded-full" style={{ background: isSelected ? 'rgba(255,255,255,0.8)' : categoryColors[c] }} />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected day tasks */}
      {selected && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm text-gray-700">
              {new Date(selected + 'T12:00:00').toLocaleDateString('ru', { day: 'numeric', month: 'long' })}
            </h3>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1 text-xs font-medium text-indigo-600"
            >
              <Plus size={14} /> Добавить
            </button>
          </div>

          {showAdd && (
            <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3 shadow-sm">
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
                placeholder="Название задачи"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
              <div className="flex gap-2">
                <input
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                  placeholder="Время (09:00)"
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                />
                <select
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value as TaskCategory })}
                >
                  {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAdd} className="flex-1 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#6366f1' }}>
                  Добавить
                </button>
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-xl text-sm font-medium bg-gray-100">
                  Отмена
                </button>
              </div>
            </div>
          )}

          {selectedTasks.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Нет задач на этот день</p>
          ) : (
            selectedTasks.map((task) => (
              <div key={task.id}
                className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100"
                style={{ borderLeftWidth: 3, borderLeftColor: categoryColors[task.category] }}
              >
                <button
                  onClick={() => toggleCalendarTask(task.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ background: task.done ? categoryColors[task.category] : '#f3f4f6', color: task.done ? 'white' : '#9ca3af' }}
                >
                  {task.done ? <Check size={12} /> : null}
                </button>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${task.done ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
                  {task.time && <p className="text-xs text-gray-400">{task.time} · {categoryLabels[task.category]}</p>}
                </div>
                <button onClick={() => setEditingTask(task)} className="text-gray-200 hover:text-blue-400">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteCalendarTask(task.id)} className="text-gray-200 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
      {editingTask && (
        <EditModal
          title="Редактировать задачу"
          accentColor="#06b6d4"
          fields={[
            { key: 'title', label: 'Название', type: 'text' },
            { key: 'time', label: 'Время', type: 'time' },
            { key: 'category', label: 'Категория', type: 'select', options: Object.entries(categoryLabels).map(([v, l]) => ({ value: v, label: l })) },
          ]}
          values={{ title: editingTask.title, time: editingTask.time || '', category: editingTask.category }}
          onSave={(v) => updateCalendarTask(editingTask.id, { title: String(v.title), time: String(v.time), category: v.category as TaskCategory })}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}
