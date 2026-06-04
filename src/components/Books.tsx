import { useState } from 'react'
import { useStore, type BookStatus, type BookGenre, type Book } from '../store'
import { Plus, Trash2, BookOpen, CheckCircle2, Clock, Star, ChevronDown, ChevronUp, Pencil } from 'lucide-react'

const STATUS_CONFIG: Record<BookStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  want:    { label: 'Хочу прочитать', color: '#9ca3af', bg: '#f3f4f6',  icon: <Clock size={14} /> },
  reading: { label: 'Читаю',          color: '#3b82f6', bg: '#eff6ff',  icon: <BookOpen size={14} /> },
  done:    { label: 'Прочитано',      color: '#22c55e', bg: '#f0fdf4',  icon: <CheckCircle2 size={14} /> },
}

export function Books() {
  const { books, addBook, updateBook, setBookStatus, setBookPages, deleteBook } = useStore()
  const [filter, setFilter] = useState<BookGenre | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<BookStatus | 'all'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [pagesInput, setPagesInput] = useState<Record<string, string>>({})
  const [form, setForm] = useState({ title: '', author: '', genre: 'motivational' as BookGenre, pages: '' })

  const filtered = books.filter(b =>
    (filter === 'all' || b.genre === filter) &&
    (statusFilter === 'all' || b.status === statusFilter)
  )

  const doneThisMonth = books.filter(b => {
    if (b.status !== 'done') return false
    const now = new Date()
    const added = new Date(b.addedDate)
    return added.getMonth() === now.getMonth() && added.getFullYear() === now.getFullYear()
  }).length

  const currentlyReading = books.filter(b => b.status === 'reading')
  const totalDone = books.filter(b => b.status === 'done').length

  const handleAdd = () => {
    if (!form.title.trim() || !form.author.trim()) return
    addBook({ title: form.title, author: form.author, genre: form.genre, status: 'want', pages: Number(form.pages) || undefined })
    setForm({ title: '', author: '', genre: 'motivational', pages: '' })
    setShowAdd(false)
  }

  const handlePagesUpdate = (book: Book) => {
    const val = Number(pagesInput[book.id])
    if (!isNaN(val) && val >= 0) {
      setBookPages(book.id, val)
      if (book.pages && val >= book.pages) setBookStatus(book.id, 'done')
    }
    setPagesInput(p => ({ ...p, [book.id]: '' }))
  }

  return (
    <div className="pb-6 space-y-4">
      {/* Header stats */}
      <div className="rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-amber-100 text-xs font-medium">Книги · цель 2 в месяц</p>
            <p className="text-2xl font-bold mt-0.5">{doneThisMonth} <span className="text-base font-normal text-amber-200">/ 2 в этом месяце</span></p>
          </div>
          <div className="text-right">
            <p className="text-amber-100 text-xs">Всего прочитано</p>
            <p className="text-2xl font-bold">{totalDone}</p>
          </div>
        </div>
        {/* Month progress */}
        <div className="w-full h-2 bg-amber-600/40 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, doneThisMonth / 2 * 100)}%` }} />
        </div>
        {currentlyReading.length > 0 && (
          <p className="text-amber-100 text-xs mt-2">
            📖 Сейчас читаю: {currentlyReading.map(b => b.title).join(', ')}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'Все' },
          { key: 'motivational', label: '💡 Мотивационные' },
          { key: 'fiction', label: '📖 Художественные' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key as BookGenre | 'all')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: filter === f.key ? '#f59e0b' : '#f3f4f6',
              color: filter === f.key ? 'white' : '#6b7280',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {(['all', 'want', 'reading', 'done'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: statusFilter === s ? (s === 'all' ? '#6366f1' : STATUS_CONFIG[s]?.color ?? '#6366f1') : '#f3f4f6',
              color: statusFilter === s ? 'white' : '#6b7280',
            }}>
            {s === 'all' ? 'Все' : STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      {/* Add button */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-400">{filtered.length} книг</p>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl">
          <Plus size={14} /> Добавить книгу
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-2xl p-4 border border-amber-100 space-y-3 shadow-sm">
          <h3 className="font-semibold text-sm">Новая книга</h3>
          <input className="w-full border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-300"
            placeholder="Название книги"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} />
          <input className="w-full border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-300"
            placeholder="Автор"
            value={form.author}
            onChange={e => setForm({ ...form, author: e.target.value })} />
          <div className="flex gap-2">
            <select className="flex-1 border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none"
              value={form.genre}
              onChange={e => setForm({ ...form, genre: e.target.value as BookGenre })}>
              <option value="motivational">💡 Мотивационная</option>
              <option value="fiction">📖 Художественная</option>
            </select>
            <input className="w-24 border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none"
              type="number" placeholder="стр."
              value={form.pages}
              onChange={e => setForm({ ...form, pages: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd}
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: '#f59e0b' }}>
              Добавить
            </button>
            <button onClick={() => setShowAdd(false)}
              className="flex-1 py-2.5 rounded-xl text-sm bg-gray-100 text-gray-600">
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Edit form */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}
          onClick={() => setEditingBook(null)}>
          <div className="w-full max-w-lg bg-white rounded-t-3xl p-5 space-y-3"
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
            <h3 className="font-bold text-base">Редактировать книгу</h3>
            <input className="w-full border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-300"
              placeholder="Название" defaultValue={editingBook.title}
              id="edit-title" />
            <input className="w-full border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-300"
              placeholder="Автор" defaultValue={editingBook.author}
              id="edit-author" />
            <div className="flex gap-2">
              <select className="flex-1 border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none"
                defaultValue={editingBook.genre} id="edit-genre">
                <option value="motivational">💡 Мотивационная</option>
                <option value="fiction">📖 Художественная</option>
              </select>
              <input className="w-24 border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none"
                type="number" placeholder="стр." defaultValue={editingBook.pages}
                id="edit-pages" />
            </div>
            <button
              onClick={() => {
                updateBook(editingBook.id, {
                  title: (document.getElementById('edit-title') as HTMLInputElement).value,
                  author: (document.getElementById('edit-author') as HTMLInputElement).value,
                  genre: (document.getElementById('edit-genre') as HTMLSelectElement).value as BookGenre,
                  pages: Number((document.getElementById('edit-pages') as HTMLInputElement).value) || undefined,
                })
                setEditingBook(null)
              }}
              className="w-full py-3 rounded-2xl text-white font-bold text-sm"
              style={{ background: '#f59e0b' }}>
              Сохранить
            </button>
          </div>
        </div>
      )}

      {/* Book list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">Нет книг в этой категории</p>
        )}
        {filtered.map(book => {
          const cfg = STATUS_CONFIG[book.status]
          const isOpen = expanded === book.id
          const pct = book.pages && book.pagesRead ? Math.round(book.pagesRead / book.pages * 100) : 0

          return (
            <div key={book.id} className="bg-white rounded-2xl border overflow-hidden shadow-sm"
              style={{ borderColor: book.status === 'reading' ? '#bfdbfe' : book.status === 'done' ? '#bbf7d0' : '#e5e7eb' }}>
              {/* Card header */}
              <div className="p-3.5 flex items-start gap-3 cursor-pointer"
                onClick={() => setExpanded(isOpen ? null : book.id)}>
                {/* Genre badge */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: book.genre === 'motivational' ? '#fef3c7' : '#ede9fe' }}>
                  {book.genre === 'motivational' ? '💡' : '📖'}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight">{book.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{book.author}</p>

                  {/* Progress bar (reading) */}
                  {book.status === 'reading' && book.pages && (
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full transition-all"
                          style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{book.pagesRead ?? 0} / {book.pages} стр. · {pct}%</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full"
                    style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.icon} {cfg.label}
                  </span>
                  {isOpen ? <ChevronUp size={14} className="text-gray-300" /> : <ChevronDown size={14} className="text-gray-300" />}
                </div>
              </div>

              {/* Expanded panel */}
              {isOpen && (
                <div className="px-3.5 pb-3.5 border-t border-gray-50 pt-3 space-y-3">
                  {/* Status switcher */}
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Статус</p>
                    <div className="flex gap-1.5">
                      {(['want', 'reading', 'done'] as BookStatus[]).map(s => (
                        <button key={s} onClick={() => setBookStatus(book.id, s)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
                          style={{
                            background: book.status === s ? STATUS_CONFIG[s].color : '#f3f4f6',
                            color: book.status === s ? 'white' : '#6b7280',
                          }}>
                          {STATUS_CONFIG[s].icon}
                          {s === 'want' ? 'Хочу' : s === 'reading' ? 'Читаю' : 'Прочитала'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Page tracker */}
                  {book.status === 'reading' && book.pages && (
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                        Страницы ({book.pagesRead ?? 0} из {book.pages})
                      </p>
                      <div className="flex gap-2">
                        <input type="number"
                          className="flex-1 border-2 border-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-300"
                          placeholder={`Сейчас на стр. ${book.pagesRead ?? 0}`}
                          value={pagesInput[book.id] ?? ''}
                          onChange={e => setPagesInput(p => ({ ...p, [book.id]: e.target.value }))}
                        />
                        <button onClick={() => handlePagesUpdate(book)}
                          className="px-4 py-2 rounded-xl text-white text-sm font-semibold bg-blue-500">
                          ОК
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Star rating for done */}
                  {book.status === 'done' && (
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Оценка</p>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(n => (
                          <button key={n} onClick={() => updateBook(book.id, { note: '⭐'.repeat(n) })}
                            className="text-xl transition-transform hover:scale-110">
                            {n <= ((book.note?.match(/⭐/g)?.length ?? 0)) ? '⭐' : '☆'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Note */}
                  {book.note && !book.note.match(/^⭐+$/) && (
                    <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-2.5 italic">"{book.note}"</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setEditingBook(book)}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-600">
                      <Pencil size={12} /> Изменить
                    </button>
                    <button onClick={() => { deleteBook(book.id); setExpanded(null) }}
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600">
                      <Trash2 size={12} /> Удалить
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
