import { useState } from 'react'
import { useStore, type ScheduleType, type CustomBlock } from '../store'
import { Plus, Trash2, CheckCircle2, Circle, ChevronDown, ChevronUp, StickyNote } from 'lucide-react'

const WEEKDAY_SCHEDULE = [
  { time: '06:30', label: 'Подъём, стакан воды', type: 'rest' as ScheduleType, detail: 'Начни день со стакана воды. Открой шторы, впусти свет — это перезапускает биоритмы.' },
  { time: '06:40', label: 'Медитация ходьбой 40 мин', type: 'habit' as ScheduleType, detail: 'Наушники, любимый подкаст или музыка. Прогулка на свежем воздухе — главный заряд дня.' },
  { time: '07:30', label: 'Йога 30 мин (пн/ср/пт)', type: 'habit' as ScheduleType, detail: 'Пн, Ср, Пт — 30 минут йоги. В другие дни — лёгкая растяжка 10 минут.' },
  { time: '08:00', label: 'Завтрак для семьи + сборы детей', type: 'kids' as ScheduleType, detail: 'Собери детей в школу. Завтрак из заготовок — каша, яйца, фрукты. Быстро и питательно.' },
  { time: '09:00', label: 'Личное время: планирование, почта', type: 'work' as ScheduleType, detail: 'Просмотр почты, планирование задач на день. Не более 1 часа на административные задачи.' },
  { time: '10:00', label: 'Работа', type: 'work' as ScheduleType, detail: 'Основное рабочее время. Фокус на приоритетных задачах. Телефон на беззвучный.' },
  { time: '13:00', label: 'Обеденный перерыв + прогулка', type: 'rest' as ScheduleType, detail: 'Обед из заготовок. Небольшая прогулка 10–15 минут для перезагрузки мозга.' },
  { time: '14:00', label: 'Работа', type: 'work' as ScheduleType, detail: 'Вторая рабочая сессия. Встречи и звонки лучше планировать на это время.' },
  { time: '17:00', label: 'Конец работы / встреча детей', type: 'kids' as ScheduleType, detail: 'Закрой рабочие задачи. Переключись в режим мамы — встреть детей, спроси как день.' },
  { time: '17:30', label: 'Английский язык 45 мин', type: 'study' as ScheduleType, detail: '45 минут — твоя инвестиция в B2. Duolingo / Skyeng / YouTube. Ежедневно без исключений.' },
  { time: '18:30', label: 'Ужин из заготовок', type: 'food' as ScheduleType, detail: 'Разогрей готовое из контейнеров. Стол накрыт за 5 минут — это и есть магия заготовок.' },
  { time: '19:00', label: 'Ужин всей семьёй', type: 'family' as ScheduleType, detail: 'Семейный ужин без телефонов. Поговори с каждым ребёнком — как день, что нового.' },
  { time: '19:30', label: 'Дети: уроки, купание, укладывание', type: 'kids' as ScheduleType, detail: 'Помощь с домашними заданиями, купание, чтение перед сном, укладывание младших.' },
  { time: '20:30', label: 'Личное время: цели, бизнес', type: 'goals' as ScheduleType, detail: 'Твоё время для роста. Работа над бизнесом, обучение, планирование. Главные 60 минут дня.' },
  { time: '21:30', label: 'Чтение 30 мин', type: 'habit' as ScheduleType, detail: '2 книги в месяц — это 30 страниц в день. Бумажная книга, никаких экранов перед сном.' },
  { time: '22:00', label: 'Дневник благодарности', type: 'habit' as ScheduleType, detail: 'Запиши 3 вещи, за которые ты благодарна сегодня. Эта привычка меняет восприятие жизни.' },
  { time: '22:30', label: 'Подготовка ко сну', type: 'rest' as ScheduleType, detail: 'Умывание, уход за собой. Подготовь одежду на завтра. Отложи телефон за 30 минут до сна.' },
  { time: '23:00', label: 'Сон', type: 'rest' as ScheduleType, detail: '8 часов сна — не роскошь, а топливо для всего остального. Ложись вовремя.' },
]

const SUNDAY_SCHEDULE = [
  { time: '07:30', label: 'Подъём, завтрак, семья', type: 'family' as ScheduleType, detail: 'Воскресное утро без будильника. Неспешный завтрак всей семьёй.' },
  { time: '09:00', label: 'Медитация + йога', type: 'habit' as ScheduleType, detail: 'Удлинённая практика — 40 мин медитации + 30 мин йоги. Никуда не торопиться.' },
  { time: '10:30', label: 'Время с детьми', type: 'kids' as ScheduleType, detail: 'Игры, настолки, прогулка. Полное присутствие — телефон убери.' },
  { time: '13:00', label: 'Обед всей семьёй', type: 'family' as ScheduleType, detail: 'Большой семейный обед. Можно пригласить бабушку или подруг.' },
  { time: '14:00', label: 'Отдых / прогулка с семьёй', type: 'family' as ScheduleType, detail: 'Парк, кино, поездка за город — что душе угодно. Перезарядка перед неделей.' },
  { time: '17:00', label: 'Старт заготовок 🍱', type: 'food' as ScheduleType, detail: 'Главное воскресное дело! 3 часа — и вся неделя обеспечена едой. Включи музыку и вперёд.' },
  { time: '20:00', label: 'Раскладка по контейнерам', type: 'food' as ScheduleType, detail: 'Раскладывай по порциям, подписывай контейнеры. Поставь в холодильник и морозилку.' },
  { time: '21:00', label: 'Планирование недели', type: 'goals' as ScheduleType, detail: 'Открой приложение. Просмотри цели, расставь задачи на каждый день. 30 минут сейчас = спокойная неделя.' },
  { time: '22:30', label: 'Сон', type: 'rest' as ScheduleType, detail: 'Завтра понедельник — новые возможности. Спать вовремя.' },
]

const TYPE_STYLES: Record<ScheduleType, { bg: string; border: string; dot: string }> = {
  rest:     { bg: '#f9fafb', border: '#e5e7eb', dot: '#9ca3af' },
  habit:    { bg: '#f0fdf4', border: '#bbf7d0', dot: '#22c55e' },
  work:     { bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6' },
  kids:     { bg: '#fff7ed', border: '#fed7aa', dot: '#f97316' },
  family:   { bg: '#fdf2f8', border: '#f9a8d4', dot: '#ec4899' },
  food:     { bg: '#f0fdf4', border: '#bbf7d0', dot: '#86efac' },
  study:    { bg: '#fffbeb', border: '#fde68a', dot: '#f59e0b' },
  goals:    { bg: '#f5f3ff', border: '#ddd6fe', dot: '#8b5cf6' },
  personal: { bg: '#faf5ff', border: '#e9d5ff', dot: '#a855f7' },
}

const TYPE_LABELS: Record<ScheduleType, string> = {
  rest: 'Отдых', habit: 'Привычка', work: 'Работа', kids: 'Дети',
  family: 'Семья', food: 'Еда', study: 'Учёба', goals: 'Цели', personal: 'Личное',
}

const TYPE_EMOJIS: Record<ScheduleType, string> = {
  rest: '😴', habit: '✨', work: '💼', kids: '👧',
  family: '❤️', food: '🍱', study: '📚', goals: '🎯', personal: '💜',
}

export function Schedule({ onAddPlan }: { onAddPlan?: () => void }) {
  const { customBlocks, toggleCustomBlock, deleteCustomBlock, scheduleNotes, setScheduleNote } = useStore()
  const dow = new Date().getDay()
  const today = new Date().toISOString().slice(0, 10)
  const [view, setView] = useState<'weekday' | 'sunday'>(dow === 0 ? 'sunday' : 'weekday')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')

  const schedule = view === 'sunday' ? SUNDAY_SCHEDULE : WEEKDAY_SCHEDULE
  const nowTime = new Date().toTimeString().slice(0, 5)
  const currentIdx = schedule.findIndex((_, i) => {
    const next = schedule[i + 1]
    return schedule[i].time <= nowTime && (!next || next.time > nowTime)
  })

  const todayCustom = customBlocks.filter((b) => b.date === today)

  const allBlocks = [
    ...schedule.map((s, i) => ({ ...s, id: `${s.time}-${view}`, isCustom: false, idx: i, done: false })),
    ...todayCustom.map((b) => ({ ...b, detail: b.note || '', isCustom: true, idx: -1 })),
  ].sort((a, b) => a.time.localeCompare(b.time))

  const toggleExpand = (id: string) => setExpanded(expanded === id ? null : id)

  const startNote = (blockKey: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const existing = scheduleNotes.find((n) => n.blockKey === blockKey)
    setNoteText(existing?.note || '')
    setEditingNote(blockKey)
  }

  const saveNote = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (editingNote) { setScheduleNote(editingNote, noteText); setEditingNote(null) }
  }

  return (
    <div className="pb-6">
      {/* View toggle */}
      <div className="flex gap-2 mb-4">
        {(['weekday', 'sunday'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: view === v ? '#6366f1' : '#f3f4f6', color: view === v ? 'white' : '#374151' }}>
            {v === 'weekday' ? '📅 Будни' : '☀️ Воскресенье'}
          </button>
        ))}
      </div>

      {/* Custom plans bar */}
      {todayCustom.length > 0 && (
        <div className="mb-3 px-1 flex items-center justify-between">
          <span className="text-xs text-gray-500">+ {todayCustom.length} моих {todayCustom.length === 1 ? 'план' : 'плана'} на сегодня</span>
          <span className="text-xs font-semibold text-amber-500">{todayCustom.filter(b => b.done).length}/{todayCustom.length} выполнено</span>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-1.5 relative">
        <div className="absolute left-[76px] top-4 bottom-4 w-0.5 bg-gray-100 z-0" />

        {allBlocks.map((item) => {
          const style = TYPE_STYLES[item.type] || TYPE_STYLES.rest
          const isCurrent = !item.isCustom && item.idx === currentIdx
          const isOpen = expanded === item.id
          const note = scheduleNotes.find((n) => n.blockKey === item.id)?.note
          const customItem = item.isCustom ? (customBlocks.find(b => b.id === item.id) as CustomBlock) : null

          return (
            <div key={item.id} className="relative z-10">
              <div className="flex gap-2 items-start cursor-pointer" onClick={() => toggleExpand(item.id)}>
                {/* Time label */}
                <div className="flex-shrink-0 w-[68px] text-right pt-2.5">
                  <span className="text-xs font-semibold" style={{ color: isCurrent ? '#6366f1' : '#9ca3af' }}>
                    {item.time}
                  </span>
                </div>

                {/* Dot */}
                <div className="flex-shrink-0 pt-2.5 flex items-start">
                  <div className="w-3 h-3 rounded-full ring-2 ring-white"
                    style={{ background: isCurrent ? '#6366f1' : item.isCustom ? '#f59e0b' : style.dot }} />
                </div>

                {/* Card */}
                <div className="flex-1 rounded-2xl overflow-hidden mb-0.5"
                  style={{
                    background: isCurrent ? '#eef2ff' : item.isCustom ? '#fffbeb' : style.bg,
                    border: `1.5px solid ${isCurrent ? '#c7d2fe' : item.isCustom ? '#fde68a' : style.border}`,
                    boxShadow: isCurrent ? '0 2px 12px rgba(99,102,241,0.12)' : 'none',
                  }}>
                  {/* Header row */}
                  <div className="px-3 py-2.5 flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{TYPE_EMOJIS[item.type]}</span>
                        <p className="text-sm font-semibold"
                          style={{ color: isCurrent ? '#4338ca' : item.isCustom ? '#92400e' : '#1f2937',
                            textDecoration: customItem?.done ? 'line-through' : 'none' }}>
                          {item.label}
                        </p>
                        {item.isCustom && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600">МОЙ ПЛАН</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs" style={{ color: style.dot }}>{TYPE_LABELS[item.type]}</span>
                        {note && <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><StickyNote size={9} /> заметка</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {customItem && (
                        <button onClick={(e) => { e.stopPropagation(); toggleCustomBlock(item.id) }}>
                          {customItem.done
                            ? <CheckCircle2 size={18} className="text-amber-400" />
                            : <Circle size={18} className="text-gray-300" />}
                        </button>
                      )}
                      {isOpen
                        ? <ChevronUp size={15} className="text-gray-300" />
                        : <ChevronDown size={15} className="text-gray-300" />}
                    </div>
                  </div>

                  {/* Expanded panel */}
                  {isOpen && (
                    <div className="px-3 pb-3 pt-0 border-t"
                      style={{ borderColor: isCurrent ? '#c7d2fe' : item.isCustom ? '#fde68a' : style.border }}>
                      {/* Detail */}
                      {item.detail && !item.isCustom && (
                        <p className="text-sm text-gray-500 mt-2.5 leading-relaxed">{item.detail}</p>
                      )}

                      {/* Note */}
                      <div className="mt-2.5" onClick={(e) => e.stopPropagation()}>
                        {editingNote === item.id ? (
                          <div className="space-y-2">
                            <textarea autoFocus rows={3}
                              className="w-full text-sm border border-gray-200 rounded-xl p-2.5 outline-none resize-none focus:border-indigo-300 bg-white"
                              placeholder="Добавь заметку..."
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <button onClick={saveNote}
                                className="flex-1 py-1.5 rounded-lg text-white text-xs font-semibold bg-indigo-500">
                                Сохранить
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setEditingNote(null) }}
                                className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-600">
                                Отмена
                              </button>
                            </div>
                          </div>
                        ) : note ? (
                          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-2.5 flex items-start gap-2">
                            <StickyNote size={13} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-700 leading-relaxed">{note}</p>
                              <button onClick={(e) => startNote(item.id, e)}
                                className="text-[11px] text-indigo-500 mt-1 font-medium">Изменить</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={(e) => startNote(item.id, e)}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-500 transition-colors">
                            <StickyNote size={12} /> Добавить заметку
                          </button>
                        )}
                      </div>

                      {/* Delete custom */}
                      {item.isCustom && (
                        <button onClick={(e) => { e.stopPropagation(); deleteCustomBlock(item.id) }}
                          className="mt-2.5 flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={11} /> Удалить этот план
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add plan CTA */}
      <button onClick={onAddPlan}
        className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold border-2 border-dashed transition-all"
        style={{ borderColor: '#c7d2fe', color: '#6366f1', background: '#f5f3ff' }}>
        <Plus size={18} /> Добавить свой план на сегодня
      </button>
    </div>
  )
}
