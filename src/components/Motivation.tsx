import { useState } from 'react'
import { useStore } from '../store'

import { Star, Trophy, Plus } from 'lucide-react'

const QUOTES = [
  'Ты не просто мама — ты человек, который строит будущее четырёх людей и своё одновременно.',
  'Дисциплина — это мост между целями и достижениями. — Джим Рон',
  'Маленькие ежедневные улучшения ведут к поразительным долгосрочным результатам.',
  'Вы не достигаете уровня своих целей — вы опускаетесь до уровня своих систем. — Джеймс Клир',
  'Усталость — это временно. Гордость за себя — навсегда.',
  'Самый лучший момент для начала был вчера. Следующий лучший — сейчас.',
  'Каждое утро ты выбираешь: кто ты сегодня? Выбирай лучшую версию себя.',
]

const REASONS = [
  { icon: '💪', text: 'Быть энергичной и здоровой мамой для четырёх детей' },
  { icon: '💰', text: 'Финансовая свобода и безопасность семьи' },
  { icon: '🌍', text: 'Открыть возможности через знание английского' },
  { icon: '❤️', text: 'Позаботиться о здоровье — пройти обследование' },
  { icon: '📚', text: 'Расти каждый день — читать, думать, развиваться' },
  { icon: '⭐', text: 'Показать детям своим примером, что цели достигаются' },
]

export function Motivation() {
  const { habits, achievements, addAchievement } = useStore()
  const [quoteIdx, setQuoteIdx] = useState(new Date().getDay() % QUOTES.length)
  const [showAddAch, setShowAddAch] = useState(false)
  const [achForm, setAchForm] = useState({ title: '', icon: '🏆' })

  // Build 7-week heatmap (49 days)
  const days49 = Array.from({ length: 49 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (48 - i))
    return d.toISOString().slice(0, 10)
  })
  const weeks = Array.from({ length: 7 }, (_, w) => days49.slice(w * 7, w * 7 + 7))

  const activityFor = (day: string) => habits.filter(h => h.completedDates.includes(day)).length

  return (
    <div className="pb-6 space-y-4">
      {/* Quote carousel */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        onClick={() => setQuoteIdx((quoteIdx + 1) % QUOTES.length)}
      >
        <p className="text-white text-base leading-relaxed font-medium">✨ {QUOTES[quoteIdx]}</p>
        <p className="text-purple-200 text-xs mt-2">Нажми для следующей →</p>
      </div>

      {/* Why I do this */}
      <section>
        <h3 className="font-bold text-base mb-2 flex items-center gap-2">
          <Star size={16} className="text-yellow-500" /> Зачем я это делаю
        </h3>
        <div className="space-y-2">
          {REASONS.map((r, i) => (
            <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 flex items-center gap-3">
              <span className="text-xl flex-shrink-0">{r.icon}</span>
              <p className="text-sm font-medium">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Heatmap 7 weeks */}
      <section>
        <h3 className="font-bold text-base mb-2">Тепловая карта (7 недель)</h3>
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex gap-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1 flex-1">
                {week.map((day) => {
                  const count = activityFor(day)
                  const maxH = Math.max(1, habits.length)
                  const ratio = count / maxH
                  return (
                    <div
                      key={day}
                      title={`${day}: ${count} привычек`}
                      className="aspect-square rounded"
                      style={{
                        background: ratio === 0 ? '#f3f4f6' : ratio < 0.3 ? '#bbf7d0' : ratio < 0.6 ? '#4ade80' : ratio < 0.9 ? '#16a34a' : '#15803d',
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 mt-2 justify-end">
            {['#f3f4f6', '#bbf7d0', '#4ade80', '#16a34a'].map((c, i) => (
              <div key={i} className="w-3 h-3 rounded" style={{ background: c }} />
            ))}
            <span className="text-xs text-gray-400 ml-1">Больше</span>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Trophy size={16} className="text-yellow-500" /> Достижения
          </h3>
          <button onClick={() => setShowAddAch(true)} className="text-xs text-indigo-600 flex items-center gap-1">
            <Plus size={12} /> Добавить
          </button>
        </div>

        {showAddAch && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3 mb-2">
            <div className="flex gap-2">
              <input
                className="w-14 border border-gray-200 rounded-xl px-2 py-2 text-center text-sm outline-none"
                placeholder="🏆"
                value={achForm.icon}
                onChange={e => setAchForm({ ...achForm, icon: e.target.value })}
              />
              <input
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
                placeholder="Описание достижения"
                value={achForm.title}
                onChange={e => setAchForm({ ...achForm, title: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { addAchievement(achForm.title, achForm.icon); setAchForm({ title: '', icon: '🏆' }); setShowAddAch(false) }}
                className="flex-1 py-2 rounded-xl text-white text-sm font-medium"
                style={{ background: '#f59e0b' }}
              >
                Добавить
              </button>
              <button onClick={() => setShowAddAch(false)} className="flex-1 py-2 rounded-xl text-sm bg-gray-100">Отмена</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {achievements.map((a) => (
            <div key={a.id} className="bg-white rounded-xl p-3 border border-gray-100 flex items-center gap-3">
              <span className="text-2xl flex-shrink-0">{a.icon}</span>
              <div>
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="text-xs text-gray-400">{new Date(a.date + 'T12:00:00').toLocaleDateString('ru', { day: 'numeric', month: 'long' })}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
