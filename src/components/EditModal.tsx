import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'

interface Field {
  key: string
  label: string
  type: 'text' | 'number' | 'time' | 'select' | 'textarea'
  options?: { value: string; label: string }[]
  placeholder?: string
}

interface Props {
  title: string
  fields: Field[]
  values: Record<string, string | number>
  onSave: (values: Record<string, string | number>) => void
  onClose: () => void
  accentColor?: string
}

export function EditModal({ title, fields, values, onSave, onClose, accentColor = '#6366f1' }: Props) {
  const [form, setForm] = useState<Record<string, string | number>>(values)

  useEffect(() => { setForm(values) }, [])

  const set = (key: string, val: string | number) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl p-5 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto" />
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <X size={15} />
          </button>
        </div>

        {fields.map(f => (
          <div key={f.key}>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
              {f.label}
            </label>
            {f.type === 'select' ? (
              <select
                className="w-full border-2 border-gray-100 focus:border-indigo-200 rounded-xl px-4 py-3 text-sm outline-none"
                value={String(form[f.key] ?? '')}
                onChange={e => set(f.key, e.target.value)}
              >
                {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea
                rows={3}
                className="w-full border-2 border-gray-100 focus:border-indigo-200 rounded-xl px-4 py-3 text-sm outline-none resize-none"
                placeholder={f.placeholder}
                value={String(form[f.key] ?? '')}
                onChange={e => set(f.key, e.target.value)}
              />
            ) : (
              <input
                type={f.type}
                className="w-full border-2 border-gray-100 focus:border-indigo-200 rounded-xl px-4 py-3 text-sm outline-none"
                placeholder={f.placeholder}
                value={form[f.key] ?? ''}
                onChange={e => set(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
              />
            )}
          </div>
        ))}

        <button
          onClick={() => { onSave(form); onClose() }}
          className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2"
          style={{ background: accentColor }}
        >
          <Save size={16} /> Сохранить изменения
        </button>
      </div>
    </div>
  )
}
