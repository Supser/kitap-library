'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import BookModal from '@/components/BookModal'
import { BOOKS, GRADE_LABELS, type Book } from '@/lib/books'

const GRADES = ['all', '6', '7', '8', '9', '10', 'dynasty', 'teacher']

export default function CatalogPage() {
  const [lang, setLang] = useState('ru')
  const [grade, setGrade] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const filtered = BOOKS
    .filter(b => grade === 'all' || b.grade === grade)
    .filter(b => {
      const q = search.toLowerCase()
      return !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    })

  const getBadge = (g: string) => {
    if (g === 'dynasty') return { label: lang === 'kz' ? 'Әулет' : 'Династия', bg: '#c9a84c', c: '#0e1c3a' }
    if (g === 'teacher') return { label: lang === 'kz' ? 'Ұстаз' : 'Педагог', bg: '#1a5030', c: '#fff' }
    return { label: `${g}${lang === 'kz' ? ' сынып' : ' кл'}`, bg: 'rgba(255,255,255,0.18)', c: 'rgba(255,255,255,0.95)' }
  }

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <div style={{ paddingTop: 64, minHeight: '100vh', background: '#f8f6f1' }}>
        <div style={{ padding: '48px 2.5rem 80px', maxWidth: 1200, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.14em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: 8 }}>
              {lang === 'kz' ? 'Тізімді таңдау' : 'Выбор списка'}
            </div>
            <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 26, fontWeight: 700, color: '#0e1c3a' }}>
              {lang === 'kz' ? 'Кітап каталогы' : 'Каталог книг'}
            </div>
          </div>

          {/* Search */}
          <div style={{ display: 'flex', background: '#fff', border: '1px solid rgba(26,45,90,0.14)', borderRadius: 6, overflow: 'hidden', maxWidth: 440, marginBottom: 20 }}>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'kz' ? 'Атауы немесе авторы бойынша іздеу...' : 'Поиск по названию или автору...'}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, padding: '11px 16px', color: '#0e1c3a' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'rgba(14,28,58,0.3)', fontSize: 16, padding: '0 12px' }}>✕</button>
            )}
          </div>

          {/* Grade filters */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
            {GRADES.map(g => {
              const isSp = g === 'dynasty' || g === 'teacher'
              const active = grade === g
              return (
                <button key={g} onClick={() => setGrade(g)} style={{
                  background: active ? (isSp ? '#c9a84c' : '#1a2d5a') : '#fff',
                  border: `1px solid ${active ? (isSp ? '#c9a84c' : '#1a2d5a') : 'rgba(26,45,90,0.14)'}`,
                  color: active ? (isSp ? '#0e1c3a' : '#fff') : '#1a2d5a',
                  fontSize: 12, fontWeight: active && isSp ? 600 : 500,
                  padding: '7px 16px', borderRadius: 4, transition: 'all .16s'
                }}>
                  {lang === 'kz' ? GRADE_LABELS[g].kz : GRADE_LABELS[g].ru}
                </button>
              )
            })}
          </div>

          {/* Result count */}
          <div style={{ fontSize: 13, color: 'rgba(14,28,58,0.45)', marginBottom: 20 }}>
            {lang === 'kz' ? 'Кітаптар көрсетілді' : 'Показано книг'}:{' '}
            <strong style={{ color: '#0e1c3a' }}>{filtered.length}</strong>
            {grade !== 'all' && <span> — {lang === 'kz' ? GRADE_LABELS[grade].kz : GRADE_LABELS[grade].ru}</span>}
          </div>

          {/* Books grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '72px 0', color: 'rgba(14,28,58,0.3)', fontSize: 15 }}>
              📚<br /><br />{lang === 'kz' ? 'Ештеңе табылмады' : 'Ничего не найдено'}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 16 }}>
              {filtered.map(book => {
                const badge = getBadge(book.grade)
                return (
                  <div key={book.id} onClick={() => setSelectedBook(book)}
                    style={{
                      background: '#fff', borderRadius: 10, overflow: 'hidden',
                      border: '1px solid rgba(26,45,90,0.09)', cursor: 'pointer',
                      transition: 'transform .18s, box-shadow .18s'
                    }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-5px)'; el.style.boxShadow = '0 12px 32px rgba(26,45,90,0.13)' }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = '' }}
                  >
                    {/* Cover */}
                    <div style={{ height: 145, background: book.color, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: '10px 12px 12px' }}>
                      <img src={book.cover} alt={book.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
                      <div style={{ position: 'absolute', inset: 0, opacity: .1, backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)', backgroundSize: '6px 6px' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)' }} />
                      <div style={{ position: 'absolute', top: 8, right: 8, background: badge.bg, color: badge.c, borderRadius: 3, padding: '2px 7px', fontSize: 9, fontWeight: 600, zIndex: 1 }}>
                        {badge.label}
                      </div>
                      <div style={{ position: 'relative', zIndex: 1, fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.92)', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                        {book.title}
                      </div>
                    </div>
                    {/* Meta */}
                    <div style={{ padding: '10px 12px 12px' }}>
                      <div style={{ fontSize: 10, color: 'rgba(14,28,58,0.38)', marginBottom: 4, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{book.author}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#0e1c3a', lineHeight: 1.35, marginBottom: 9, minHeight: 32, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                        {book.title}
                      </div>
                      <button style={{ display: 'block', width: '100%', textAlign: 'center', background: '#c9a84c', color: '#0e1c3a', fontSize: 11, fontWeight: 700, padding: 7, borderRadius: 4, border: 'none' }}>
                        {lang === 'kz' ? 'Онлайн оқу →' : 'Читать онлайн →'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} lang={lang} />}
    </>
  )
}
