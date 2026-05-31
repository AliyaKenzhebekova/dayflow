import { useState } from 'react'

const WEEKDAY_SCHEDULE = [
  { time: '06:30', label: 'Подъём, стакан воды', type: 'rest' },
  { time: '06:40', label: 'Медитация ходьбой 40 мин', type: 'habit' },
  { time: '07:30', label: 'Йога 30 мин (пн/ср/пт)', type: 'habit' },
  { time: '08:00', label: 'Завтрак для семьи + сборы детей', type: 'kids' },
  { time: '09:00', label: 'Личное время: планирование, почта', type: 'work' },
  { time: '10:00', label: 'Работа', type: 'work' },
  { time: '13:00', label: 'Обеденный перерыв + прогулка', type: 'rest' },
  { time: '14:00', label: 'Работа', type: 'work' },
  { time: '17:00', label: 'Конец работы / встреча детей', type: 'kids' },
  { time: '17:30', label: 'Английский язык 45 мин', type: 'study' },
  { time: '18:30', label: 'Ужин из заготовок', type: 'food' },
  { time: '19:00', label: 'Ужин всей семьёй', type: 'family' },
  { time: '19:30', label: 'Дети: уроки, купание, укладывание', type: 'kids' },
  { time: '20:30', label: 'Личное время: цели, бизнес', type: 'goals' },
  { time: '21:30', label: 'Чтение 30 мин', type: 'habit' },
  { time: '22:00', label: 'Дневник благодарности', type: 'habit' },
  { time: '22:30', label: 'Подготовка ко сну', type: 'rest' },
  { time: '23:00', label: 'Сон', type: 'rest' },
]

const SUNDAY_SCHEDULE = [
  { time: '07:30', label: 'Подъём, завтрак, семья', type: 'family' },
  { time: '09:00', label: 'Медитация + йога', type: 'habit' },
  { time: '10:30', label: 'Время с детьми', type: 'kids' },
  { time: '13:00', label: 'Обед всей семьёй', type: 'family' },
  { time: '14:00', label: 'Отдых / прогулка с семьёй', type: 'family' },
  { time: '17:00', label: 'Старт заготовок 🍱', type: 'food' },
  { time: '20:00', label: 'Раскладка по контейнерам', type: 'food' },
  { time: '21:00', label: 'Планирование недели', type: 'goals' },
  { time: '22:30', label: 'Сон', type: 'rest' },
]

const TYPE_STYLES: Record<string, { bg: string; border: string; dot: string }> = {
  rest:   { bg: '#f9fafb', border: '#e5e7eb', dot: '#9ca3af' },
  habit:  { bg: '#f0fdf4', border: '#bbf7d0', dot: '#22c55e' },
  work:   { bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6' },
  kids:   { bg: '#fff7ed', border: '#fed7aa', dot: '#f97316' },
  family: { bg: '#fdf2f8', border: '#f9a8d4', dot: '#ec4899' },
  food:   { bg: '#f0fdf4', border: '#bbf7d0', dot: '#86efac' },
  study:  { bg: '#fffbeb', border: '#fde68a', dot: '#f59e0b' },
  goals:  { bg: '#f5f3ff', border: '#ddd6fe', dot: '#8b5cf6' },
}

const TYPE_LABELS: Record<string, string> = {
  rest: 'Отдых', habit: 'Привычка', work: 'Работа', kids: 'Дети',
  family: 'Семья', food: 'Еда', study: 'Учёба', goals: 'Цели',
}

export function Schedule() {
  const dow = new Date().getDay()
  const [view, setView] = useState<'weekday' | 'sunday'>(dow === 0 ? 'sunday' : 'weekday')
  const schedule = view === 'sunday' ? SUNDAY_SCHEDULE : WEEKDAY_SCHEDULE

  const nowTime = new Date().toTimeString().slice(0, 5)
  const currentIdx = schedule.findIndex((_, i) => {
    const next = schedule[i + 1]
    return schedule[i].time <= nowTime && (!next || next.time > nowTime)
  })

  return (
    <div className="pb-6">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView('weekday')}
          className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors"
          style={{
            background: view === 'weekday' ? '#6366f1' : '#f3f4f6',
            color: view === 'weekday' ? 'white' : '#374151',
          }}
        >
          Будни
        </button>
        <button
          onClick={() => setView('sunday')}
          className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors"
          style={{
            background: view === 'sunday' ? '#6366f1' : '#f3f4f6',
            color: view === 'sunday' ? 'white' : '#374151',
          }}
        >
          Воскресенье
        </button>
      </div>

      <div className="space-y-2 relative">
        {/* Timeline line */}
        <div className="absolute left-[36px] top-4 bottom-4 w-0.5 bg-gray-200 z-0" />

        {schedule.map((item, i) => {
          const style = TYPE_STYLES[item.type] || TYPE_STYLES.rest
          const isCurrent = i === currentIdx
          return (
            <div key={i} className="flex gap-3 items-start relative z-10">
              <div className="flex-shrink-0 w-[72px] text-right">
                <span className={`text-xs font-medium ${isCurrent ? 'text-indigo-600 font-bold' : 'text-gray-400'}`}>
                  {item.time}
                </span>
              </div>
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ring-2 ring-white"
                style={{ background: isCurrent ? '#6366f1' : style.dot }}
              />
              <div
                className="flex-1 rounded-xl px-3 py-2.5 mb-0.5"
                style={{
                  background: isCurrent ? '#eef2ff' : style.bg,
                  border: `1px solid ${isCurrent ? '#c7d2fe' : style.border}`,
                }}
              >
                <p className={`text-sm ${isCurrent ? 'font-semibold text-indigo-700' : 'font-medium text-gray-700'}`}>
                  {item.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: style.dot }}>{TYPE_LABELS[item.type]}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
