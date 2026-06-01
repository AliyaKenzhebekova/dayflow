import { useState } from 'react'
import { useStore, type GoalCategory, type Goal } from '../store'
import { daysLeft, goalCategoryColors, goalCategoryLabels } from '../utils'
import { Plus, Trash2, Target, Pencil } from 'lucide-react'
import { EditModal } from './EditModal'

export function Goals() {
  const { goals, updateGoalProgress, addGoal, updateGoal, deleteGoal } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [customVal, setCustomVal] = useState('')
  const [form, setForm] = useState({
    name: '',
    category: 'personal' as GoalCategory,
    daysTotal: '365',
    progress: '0',
  })

  const handleAdd = () => {
    if (!form.name.trim()) return
    addGoal({
      name: form.name,
      category: form.category,
      daysTotal: Number(form.daysTotal),
      startDate: new Date().toISOString().slice(0, 10),
      progress: Number(form.progress),
    })
    setForm({ name: '', category: 'personal', daysTotal: '365', progress: '0' })
    setShowAdd(false)
  }

  return (
    <div className="pb-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">Цели</h2>
          <p className="text-sm text-gray-500">{goals.length} целей в работе</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
          style={{ background: '#8b5cf6' }}
        >
          <Plus size={20} />
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3 shadow-sm">
          <h3 className="font-semibold text-sm">Новая цель</h3>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-400"
            placeholder="Название цели"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <div className="flex gap-2">
            <select
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value as GoalCategory })}
            >
              {Object.entries(goalCategoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input
              className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
              placeholder="Дней"
              type="number"
              value={form.daysTotal}
              onChange={e => setForm({ ...form, daysTotal: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Прогресс:</span>
            <input
              className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
              type="number"
              placeholder="0"
              value={form.progress}
              onChange={e => setForm({ ...form, progress: e.target.value })}
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#8b5cf6' }}>
              Добавить
            </button>
            <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600">
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {goals.map((g) => {
          const color = goalCategoryColors[g.category]
          const left = daysLeft(g.startDate, g.daysTotal)
          const isEditing = editing === g.id
          return (
            <div key={g.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Target size={16} style={{ color }} />
                  <div>
                    <p className="font-semibold text-sm">{g.name}</p>
                    <p className="text-xs" style={{ color }}>
                      {goalCategoryLabels[g.category]} · осталось {left} дн.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold" style={{ color }}>{g.progress}%</span>
                  <button onClick={() => setEditingGoal(g)} className="text-gray-300 hover:text-blue-400 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteGoal(g.id)} className="text-gray-200 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${g.progress}%`, background: `linear-gradient(90deg, ${color}99, ${color})` }}
                />
              </div>

              {/* Controls */}
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => updateGoalProgress(g.id, -5)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  −5%
                </button>
                <button
                  onClick={() => updateGoalProgress(g.id, 5)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  style={{ background: color }}
                >
                  +5%
                </button>
                {isEditing ? (
                  <div className="flex gap-1 flex-1">
                    <input
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none"
                      type="number"
                      placeholder="%"
                      value={customVal}
                      onChange={e => setCustomVal(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        const v = Number(customVal)
                        if (!isNaN(v)) updateGoalProgress(g.id, v - g.progress)
                        setEditing(null)
                        setCustomVal('')
                      }}
                      className="px-3 py-1.5 rounded-lg text-white text-sm"
                      style={{ background: color }}
                    >
                      ОК
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditing(g.id); setCustomVal(String(g.progress)) }}
                    className="ml-auto text-xs text-gray-400 hover:text-gray-600"
                  >
                    Вручную
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {editingGoal && (
        <EditModal
          title="Редактировать цель"
          accentColor="#8b5cf6"
          fields={[
            { key: 'name', label: 'Название цели', type: 'text' },
            { key: 'category', label: 'Категория', type: 'select', options: [
              { value: 'education', label: 'Образование' },
              { value: 'health', label: 'Здоровье' },
              { value: 'finance', label: 'Финансы' },
              { value: 'personal', label: 'Личное' },
            ]},
            { key: 'daysTotal', label: 'Срок (дней)', type: 'number' },
            { key: 'progress', label: 'Текущий прогресс (%)', type: 'number' },
          ]}
          values={{ name: editingGoal.name, category: editingGoal.category, daysTotal: editingGoal.daysTotal, progress: editingGoal.progress }}
          onSave={(v) => updateGoal(editingGoal.id, {
            name: String(v.name),
            category: v.category as GoalCategory,
            daysTotal: Number(v.daysTotal),
            progress: Math.min(100, Math.max(0, Number(v.progress))),
          })}
          onClose={() => setEditingGoal(null)}
        />
      )}
    </div>
  )
}
