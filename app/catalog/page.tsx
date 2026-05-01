'use client'
import { useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import BookModal from '@/components/BookModal'
import { BOOKS, GRADE_LABELS, type Book } from '@/lib/books'

const GRADES = ['all', '6', '7', '8', '9', '10', 'dynasty', 'teacher']

const GRADE_COLORS: Record<string, string> = {
  '6': '#2a5080', '7': '#1e4a2a', '8': '#5a2060',
  '9': '#3a2a6a', '10': '#7a4000', dynasty: '#9b6e22', teacher: '#1e3a2f',
}

export default function CatalogPage() {
  const [lang, setLang]   = useState('ru')
  const [grade, setGrade] = useState('all')
  const [search, setSearch] = useState('')
  const [view, setView]   = useState<'grid' | 'list'>('grid')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const filtered = useMemo(() => {
    let result = BOOKS
      .filter(b => grade === 'all' || b.grade === grade)
      .filter(b => {
        const q = search.toLowerCase()
        return !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      })
    return result
  }, [grade, search])

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <div style={{ paddingTop: 62, minHeight: '100vh', background: 'var(--paper)' }}>

        {/* Dark header */}
        <div style={{
          background: 'linear-gradient(160deg, #12100E 0%, #1C1814 100%)',
          padding: '52px clamp(1.5rem, 5vw, 4rem) 48px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-40%', right: '-5%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,150,62,.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1360, margin: '0 auto', position: 'relative' }}>
            <div style={{ fontSize: 10, letterSpacing: '.18em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'var(--sans)', fontWeight: 500 }}>
              {lang === 'kz' ? 'Тізімді таңдау' : 'Каталог книг'}
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, fontStyle: 'italic', color: '#F5EFE6', letterSpacing: '-.01em', marginBottom: 32 }}>
              {lang === 'kz' ? 'Кітаптар кітапханасы' : 'Библиотека книг'}
            </h1>

            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 0,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, overflow: 'hidden', maxWidth: 520,
            }}>
              <div style={{ padding: '0 16px', color: 'rgba(255,255,255,.3)', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.4"/><path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </div>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'kz' ? 'Іздеу...' : 'Поиск по названию или автору...'}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, padding: '13px 0', color: '#fff' }} />
              {search && (
                <button onClick={() => setSearch('')} style={{ padding: '0 16px', color: 'rgba(255,255,255,.3)', fontSize: 16 }}>✕</button>
              )}
            </div>
          </div>
        </div>

        {/* Filter + view toggle bar */}
        <div style={{ background: 'var(--cream)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 62, zIndex: 100 }}>
          <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)', display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
            <div style={{ display: 'flex', gap: 4, padding: '10px 0', flexShrink: 0 }}>
              {GRADES.map(g => {
                const isSp = g === 'dynasty' || g === 'teacher'
                const act = grade === g
                const label = g === 'all'
                  ? (lang === 'kz' ? 'Барлық кітап' : 'Все книги')
                  : (lang === 'kz' ? GRADE_LABELS[g]?.kz : GRADE_LABELS[g]?.ru) || g
                return (
                  <button key={g} onClick={() => setGrade(g)} style={{
                    padding: '5px 14px', borderRadius: 20, fontSize: 12, whiteSpace: 'nowrap',
                    background: act ? (isSp ? 'var(--gold)' : 'var(--ink)') : 'transparent',
                    color: act ? (isSp ? 'var(--ink)' : '#fff') : 'var(--ink-light)',
                    border: `1px solid ${act ? (isSp ? 'var(--gold)' : 'var(--ink)') : 'var(--border)'}`,
                    fontWeight: act ? 500 : 400,
                    transition: 'all .15s',
                  }}>
                    {label}{g === 'all' && ` (${BOOKS.length})`}
                  </button>
                )
              })}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexShrink: 0, padding: '10px 0', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
                {filtered.length} {lang === 'kz' ? 'кітап' : 'книг'}
              </span>
              {(['grid', 'list'] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} style={{
                  width: 30, height: 30, borderRadius: 5, fontSize: 14,
                  background: view === v ? 'var(--ink)' : 'transparent',
                  color: view === v ? '#fff' : 'var(--ink-faint)',
                  border: '1px solid var(--border)',
                }}>
                  {v === 'grid' ? '⊞' : '≡'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Books */}
        <div style={{ maxWidth: 1360, margin: '0 auto', padding: '36px clamp(1.5rem, 5vw, 4rem) 80px' }}>
          {filtered.length === 0 ? (
            <EmptyState lang={lang} />
          ) : view === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 24 }}>
              {filtered.map((b, i) => <CatalogCard key={b.id} book={b} lang={lang} index={i} onClick={() => setSelectedBook(b)} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filtered.map((b, i) => <ListRow key={b.id} book={b} lang={lang} index={i} onClick={() => setSelectedBook(b)} />)}
            </div>
          )}
        </div>
      </div>

      {selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} lang={lang} />}
    </>
  )
}

function CatalogCard({ book, lang, index, onClick }: { book: Book; lang: string; index: number; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  const color = GRADE_COLORS[book.grade] || '#555'
  const label = book.grade === 'dynasty'
    ? (lang === 'kz' ? 'Әулет' : 'Династия')
    : book.grade === 'teacher'
    ? (lang === 'kz' ? 'Ұстаз' : 'Педагог')
    : `${book.grade} ${lang === 'kz' ? 'сынып' : 'кл'}`

  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--cream)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
        border: `1px solid ${hov ? 'rgba(200,150,62,.35)' : 'var(--border)'}`,
        boxShadow: hov ? '0 14px 40px rgba(28,20,16,.13)' : '0 2px 8px rgba(28,20,16,.05)',
        transform: hov ? 'translateY(-6px)' : 'none',
        transition: 'all .22s cubic-bezier(.34,1.3,.64,1)',
        animation: `fadeUp .35s ${(index % 8) * 35}ms ease both`,
      }}>
      <div style={{ height: 210, background: book.color, position: 'relative', overflow: 'hidden' }}>
        <img src={book.cover} alt={book.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s', transform: hov ? 'scale(1.05)' : 'scale(1)' }}
          onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,16,14,.7) 0%, transparent 55%)' }} />
        <div style={{ position: 'absolute', top: 10, left: 10, background: color, color: '#fff', fontSize: 8.5, fontWeight: 600, fontFamily: 'var(--display)', letterSpacing: '.04em', padding: '2px 8px', borderRadius: 2 }}>{label}</div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(18,16,14,.4)', opacity: hov ? 1 : 0, transition: 'opacity .22s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--gold)', color: 'var(--ink)', fontFamily: 'var(--display)', fontSize: 10, fontWeight: 700, padding: '7px 16px', borderRadius: 4, letterSpacing: '.04em', boxShadow: '0 4px 14px rgba(200,150,62,.4)' }}>
            {lang === 'kz' ? 'Оқу →' : 'Читать →'}
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 14px 16px' }}>
        <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 4, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{book.author}</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 14, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{book.title}</div>
      </div>
    </div>
  )
}

function ListRow({ book, lang, index, onClick }: { book: Book; lang: string; index: number; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  const color = GRADE_COLORS[book.grade] || '#555'
  const label = book.grade === 'dynasty'
    ? (lang === 'kz' ? 'Оқитын Әулет' : 'Читающая Династия')
    : book.grade === 'teacher'
    ? (lang === 'kz' ? 'Оқитын Ұстаз' : 'Читающий Педагог')
    : `${book.grade} ${lang === 'kz' ? 'сынып' : 'класс'}`

  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px',
        borderRadius: 10, cursor: 'pointer',
        background: hov ? 'var(--cream)' : 'transparent',
        border: `1px solid ${hov ? 'var(--border)' : 'transparent'}`,
        transition: 'all .15s',
        animation: `slideRight .3s ${index * 20}ms ease both`,
      }}>
      <div style={{ width: 42, height: 60, background: book.color, borderRadius: 4, overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,.15)' }}>
        <img src={book.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>{book.title}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{book.author}</div>
      </div>
      <div style={{ background: `${color}22`, color, fontSize: 10, fontWeight: 600, fontFamily: 'var(--display)', padding: '3px 10px', borderRadius: 3, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  )
}

function EmptyState({ lang }: { lang: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 48, color: 'var(--paper-deep)', marginBottom: 16, fontStyle: 'italic' }}>?</div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}>{lang === 'kz' ? 'Ештеңе табылмады' : 'Ничего не найдено'}</div>
      <div style={{ fontSize: 13, color: 'var(--ink-light)' }}>{lang === 'kz' ? 'Сұрауды өзгертіп көріңіз' : 'Попробуйте изменить запрос'}</div>
    </div>
  )
}
