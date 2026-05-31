import { useState } from 'react'
import { useStore } from '../store'
import { Plus, RotateCcw, UtensilsCrossed } from 'lucide-react'

export function MealPrep() {
  const { prepItems, togglePrepItem, addPrepItem, resetPrep } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', portions: '4' })
  const done = prepItems.filter(p => p.done).length
  const pct = Math.round((done / Math.max(1, prepItems.length)) * 100)

  const handleAdd = () => {
    if (!form.name.trim()) return
    addPrepItem(form.name, Number(form.portions))
    setForm({ name: '', portions: '4' })
    setShowAdd(false)
  }

  return (
    <div className="pb-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg flex items-center gap-2">
            <UtensilsCrossed size={20} className="text-green-500" /> Заготовки
          </h2>
          <p className="text-sm text-gray-500">Воскресенье 17:00</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
          style={{ background: '#22c55e' }}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Выполнено {done} из {prepItems.length}</span>
          <span className="text-sm font-bold text-green-600">{pct}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        {pct === 100 && <p className="text-center text-sm text-green-600 font-medium mt-2">🎉 Отлично! Все заготовки готовы!</p>}
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3 shadow-sm">
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400"
            placeholder="Блюдо"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-500">Порций:</span>
            <input
              className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
              type="number"
              value={form.portions}
              onChange={e => setForm({ ...form, portions: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#22c55e' }}>
              Добавить
            </button>
            <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-xl text-sm font-medium bg-gray-100">
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {prepItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 cursor-pointer select-none"
            style={{ background: item.done ? '#f0fdf4' : 'white', borderColor: item.done ? '#bbf7d0' : '#e5e7eb' }}
            onClick={() => togglePrepItem(item.id)}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all"
              style={{ background: item.done ? '#22c55e' : '#f3f4f6', color: item.done ? 'white' : '#9ca3af' }}
            >
              {item.done ? '✓' : '○'}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${item.done ? 'line-through text-gray-400' : ''}`}>{item.name}</p>
              <p className="text-xs text-gray-400">{item.portions} порций</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={resetPrep}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <RotateCcw size={14} /> Сбросить все отметки
      </button>
    </div>
  )
}
