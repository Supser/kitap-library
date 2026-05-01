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
  const [sortAz, setSortAz] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  let filtered = BOOKS
    .filter(b => grade === 'all' || b.grade === grade)
    .filter(b => {
      const q = search.toLowerCase()
      return !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    })

  if (sortAz) filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title, 'ru'))

  const getBadge = (g: string) => {
    if (g === 'dynasty') return { label: lang === 'kz' ? 'Әулет' : 'Династия', bg: '#c9a84c', c: '#0e1c3a' }
    if (g === 'teacher') return { label: lang === 'kz' ? 'Ұстаз' : 'Педагог', bg: '#1a5030', c: '#fff' }
    return { label: `${g}${lang === 'kz' ? ' сынып' : ' кл'}`, bg: 'rgba(255,255,255,0.18)', c: 'rgba(255,255,255,0.95)' }
  }

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <div style={{ paddingTop: 64, minHeight: '100vh', background: '#f5f3ee' }}>

        {/* Dark header band */}
        <div style={{
          background: 'linear-gradient(135deg, #06080f 0%, #0e1c3a 100%)',
          padding: '48px clamp(1.5rem, 4vw, 2.5rem) 40px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Orb decoration */}
          <div style={{ position: 'absolute', top: -60, right: -40, width: 300, height: 300, background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.16em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: 10, fontFamily: "'Unbounded', sans-serif" }}>
              {lang === 'kz' ? 'Тізімді таңдау' : 'Выбор списка'}
            </div>
            <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, color: '#fff', marginBottom: 28, letterSpacing: '-.02em' }}>
              {lang === 'kz' ? 'Кітап каталогы' : 'Каталог книг'}
            </div>

            {/* Search + sort row */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
              <div style={{
                display: 'flex', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6, overflow: 'hidden', flex: '1 1 280px', maxWidth: 440,
              }}>
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder={lang === 'kz' ? 'Атауы немесе авторы...' : 'Поиск по названию или автору...'}
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, padding: '11px 16px', color: '#fff' }}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 16, padding: '0 12px' }}>✕</button>
                )}
              </div>
              <button onClick={() => setSortAz(v => !v)} style={{
                background: sortAz ? '#c9a84c' : 'rgba(255,255,255,0.07)',
                border: `1px solid ${sortAz ? '#c9a84c' : 'rgba(255,255,255,0.1)'}`,
                color: sortAz ? '#0e1c3a' : 'rgba(255,255,255,0.6)',
                fontSize: 11, fontWeight: 600, fontFamily: "'Unbounded', sans-serif",
                padding: '11px 18px', borderRadius: 6, transition: 'all .15s',
              }}>A–Z</button>
            </div>

            {/* Grade filters */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {GRADES.map(g => {
                const isSp = g === 'dynasty' || g === 'teacher'
                const active = grade === g
                return (
                  <button key={g} onClick={() => setGrade(g)} style={{
                    background: active ? (isSp ? '#c9a84c' : 'rgba(255,255,255,0.15)') : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${active ? (isSp ? '#c9a84c' : 'rgba(255,255,255,0.3)') : 'rgba(255,255,255,0.1)'}`,
                    color: active ? (isSp ? '#0e1c3a' : '#fff') : 'rgba(255,255,255,0.55)',
                    fontSize: 12, fontWeight: active ? 600 : 400,
                    padding: '7px 16px', borderRadius: 4, transition: 'all .16s',
                  }}>
                    {lang === 'kz' ? GRADE_LABELS[g].kz : GRADE_LABELS[g].ru}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Books grid */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px clamp(1.5rem, 4vw, 2.5rem) 80px' }}>
          <div style={{ fontSize: 13, color: 'rgba(14,28,58,0.45)', marginBottom: 20 }}>
            {lang === 'kz' ? 'Кітаптар көрсетілді' : 'Показано книг'}:{' '}
            <strong style={{ color: '#0e1c3a' }}>{filtered.length}</strong>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '72px 0', color: 'rgba(14,28,58,0.3)', fontSize: 15 }}>
              📚<br /><br />{lang === 'kz' ? 'Ештеңе табылмады' : 'Ничего не найдено'}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 18 }}>
              {filtered.map(book => {
                const badge = getBadge(book.grade)
                return (
                  <BookCard key={book.id} book={book} badge={badge} lang={lang} onClick={() => setSelectedBook(book)} />
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

function BookCard({ book, badge, lang, onClick }: {
  book: Book
  badge: { label: string; bg: string; c: string }
  lang: string
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid rgba(26,45,90,0.08)',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 40px rgba(26,45,90,0.15)' : '0 2px 8px rgba(26,45,90,0.06)',
        transition: 'transform .2s ease, box-shadow .2s ease',
      }}
    >
      {/* Cover */}
      <div style={{ height: 200, background: book.color, position: 'relative', overflow: 'hidden' }}>
        <img
          src={book.cover} alt={book.title}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform .3s ease',
          }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)' }} />

        {/* Badge */}
        <div style={{ position: 'absolute', top: 8, right: 8, background: badge.bg, color: badge.c, borderRadius: 3, padding: '2px 7px', fontSize: 9, fontWeight: 600 }}>
          {badge.label}
        </div>

        {/* Hover overlay CTA */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(14,28,58,0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity .2s ease',
        }}>
          <span style={{ color: '#c9a84c', fontFamily: "'Unbounded', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '.04em' }}>
            Читать →
          </span>
        </div>
      </div>

      {/* Meta */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 10, color: 'rgba(14,28,58,0.38)', marginBottom: 4, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {book.author}
        </div>
        <div style={{
          fontSize: 12, fontWeight: 600, color: '#0e1c3a', lineHeight: 1.4,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
          minHeight: 34,
        }}>
          {book.title}
        </div>
      </div>
    </div>
  )
}
