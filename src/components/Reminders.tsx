import { useStore } from '../store'
import { categoryColors, categoryLabels } from '../utils'
import { Bell, BellOff } from 'lucide-react'

export function Reminders() {
  const { reminders, toggleReminder } = useStore()
  const enabled = reminders.filter(r => r.enabled).length

  const groups = [
    { label: 'Привычки', ids: ['r1','r2','r3','r4','r5'] },
    { label: 'Семья', ids: ['r6','r7','r8','r9'] },
    { label: 'Питание и заготовки', ids: ['r10','r11','r12','r13'] },
    { label: 'Здоровье', ids: ['r14','r15'] },
  ]

  return (
    <div className="pb-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">Напоминания</h2>
          <p className="text-sm text-gray-500">Активно: {enabled} из {reminders.length}</p>
        </div>
        <div
          className="px-3 py-1 rounded-full text-sm font-semibold"
          style={{ background: '#e0e7ff', color: '#4338ca' }}
        >
          {enabled} активных
        </div>
      </div>

      {groups.map(group => {
        const groupReminders = reminders.filter(r => group.ids.includes(r.id))
        return (
          <section key={group.label}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{group.label}</p>
            <div className="space-y-2">
              {groupReminders.map(r => (
                <div key={r.id} className="bg-white rounded-xl p-3 border border-gray-100 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: categoryColors[r.category] + '20', color: categoryColors[r.category] }}
                  >
                    {r.enabled ? <Bell size={16} /> : <BellOff size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.title}</p>
                    <p className="text-xs text-gray-400">{r.time} · {r.days} · {categoryLabels[r.category]}</p>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => toggleReminder(r.id)}
                    className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                    style={{ background: r.enabled ? '#6366f1' : '#e5e7eb' }}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                      style={{ transform: r.enabled ? 'translateX(24px)' : 'translateX(4px)' }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
