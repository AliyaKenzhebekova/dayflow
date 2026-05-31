import { useStore } from '../store'
import { TODAY, streakCount, isHabitScheduledToday, goalCategoryColors, goalCategoryLabels, last7Days } from '../utils'
import { Flame, Target, CheckSquare, UtensilsCrossed, TrendingUp } from 'lucide-react'

const QUOTES = [
  'Ты не просто мама — ты человек, который строит будущее четырёх людей и своё одновременно.',
  'Дисциплина — это мост между целями и достижениями. — Джим Рон',
  'Маленькие ежедневные улучшения ведут к поразительным долгосрочным результатам.',
  'Вы не достигаете уровня своих целей — вы опускаетесь до уровня своих систем. — Джеймс Клир',
  'Усталость — это временно. Гордость за себя — навсегда.',
  'Самый лучший момент для начала был вчера. Следующий лучший — сейчас.',
  'Каждое утро ты выбираешь: кто ты сегодня? Выбирай лучшую версию себя.',
]

export function Dashboard() {
  const { habits, goals, calendarTasks, prepItems, toggleHabit } = useStore()
  const today = TODAY()
  const quoteIndex = new Date().getDay()
  const quote = QUOTES[quoteIndex % QUOTES.length]

  const todayHabits = habits.filter(isHabitScheduledToday)
  const doneToday = todayHabits.filter((h) => h.completedDates.includes(today))
  const todayTasks = calendarTasks.filter((t) => t.date === today)
  const doneTasks = todayTasks.filter((t) => t.done)
  const prepDone = prepItems.filter((p) => p.done)
  const goalsAvg = goals.reduce((s, g) => s + g.progress, 0) / Math.max(1, goals.length)

  const days7 = last7Days()

  return (
    <div className="space-y-4 pb-6">
      {/* Quote */}
      <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <p className="text-white text-sm font-medium leading-relaxed">✨ {quote}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Flame size={20} />} label="Привычки" value={`${doneToday.length}/${todayHabits.length}`} color="#f97316" />
        <StatCard icon={<CheckSquare size={20} />} label="Задачи" value={`${doneTasks.length}/${todayTasks.length}`} color="#3b82f6" />
        <StatCard icon={<Target size={20} />} label="Цели" value={`${goalsAvg.toFixed(0)}%`} color="#8b5cf6" />
        <StatCard icon={<UtensilsCrossed size={20} />} label="Заготовки" value={`${prepDone.length}/${prepItems.length}`} color="#22c55e" />
      </div>

      {/* Today Habits Quick */}
      <section>
        <h2 className="font-semibold text-base mb-2 flex items-center gap-2">
          <Flame size={16} className="text-orange-500" /> Привычки сегодня
        </h2>
        <div className="space-y-2">
          {todayHabits.map((h) => {
            const done = h.completedDates.includes(today)
            const streak = streakCount(h.completedDates)
            return (
              <div
                key={h.id}
                className="flex items-center gap-3 rounded-xl p-3 cursor-pointer select-none"
                style={{ background: done ? '#dcfce7' : 'white', border: '1px solid', borderColor: done ? '#bbf7d0' : '#e5e7eb' }}
                onClick={() => toggleHabit(h.id, today)}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: done ? '#22c55e' : '#e5e7eb', color: done ? 'white' : '#9ca3af' }}
                >
                  {done ? '✓' : '○'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{h.name}</p>
                  <p className="text-xs text-gray-500">{h.time} · {h.duration} мин</p>
                </div>
                {streak > 0 && (
                  <span className="text-xs font-bold" style={{ color: streak >= 7 ? '#ef4444' : streak >= 3 ? '#f97316' : '#6b7280' }}>
                    {streak >= 7 ? '🔥' : '✦'} {streak}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Goals Progress */}
      <section>
        <h2 className="font-semibold text-base mb-2 flex items-center gap-2">
          <Target size={16} className="text-purple-500" /> Прогресс целей
        </h2>
        <div className="space-y-2">
          {goals.map((g) => (
            <div key={g.id} className="bg-white rounded-xl p-3 border border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{g.name}</span>
                <span className="text-sm font-bold" style={{ color: goalCategoryColors[g.category] }}>{g.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${g.progress}%`, background: goalCategoryColors[g.category] }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{goalCategoryLabels[g.category]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Heatmap 7 days */}
      <section>
        <h2 className="font-semibold text-base mb-2 flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-500" /> Активность (7 дней)
        </h2>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex gap-1.5 justify-between">
            {days7.map((day) => {
              const completed = habits.filter((h) => h.completedDates.includes(day)).length
              const total = Math.max(1, habits.length)
              const ratio = completed / total
              const dayLabel = new Date(day + 'T12:00:00').toLocaleDateString('ru', { weekday: 'short' })
              return (
                <div key={day} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full aspect-square rounded-lg"
                    style={{
                      background: ratio === 0 ? '#f3f4f6' : ratio < 0.4 ? '#bbf7d0' : ratio < 0.7 ? '#4ade80' : '#16a34a',
                    }}
                  />
                  <span className="text-xs text-gray-400">{dayLabel}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '20', color }}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold" style={{ color }}>{value}</p>
      </div>
    </div>
  )
}
