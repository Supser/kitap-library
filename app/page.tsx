'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import BookModal from '@/components/BookModal'
import { BOOKS, GRADE_LABELS, type Book } from '@/lib/books'

const SHELF_HEIGHTS = [162, 178, 148, 168, 155, 175, 144, 160, 172, 150]
const SHELF_WIDTHS  = [38, 42, 36, 44, 38, 40, 36, 42, 38, 44]

export default function Home() {
  const [lang, setLang] = useState('ru')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const shelfBooks = BOOKS.slice(0, 30)

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg,#06080f 0%,#0c1225 50%,#111830 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '100px 2rem 60px', position: 'relative', overflow: 'hidden'
      }}>
        {/* Ceiling */}
        <div style={{ position: 'absolute', top: 64, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg,#8a5c00,#c9a84c 20%,#e8c97a 50%,#c9a84c 80%,#8a5c00)' }} />
        <div style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', width: 600, height: 500, background: 'radial-gradient(ellipse at top,rgba(201,168,76,0.1) 0%,transparent 65%)', pointerEvents: 'none' }} />

        {/* Text */}
        <div style={{ textAlign: 'center', marginBottom: 56, position: 'relative', zIndex: 2, maxWidth: 600 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
            color: '#d4aa50', fontSize: 10, fontWeight: 600, letterSpacing: '.12em',
            padding: '5px 14px', borderRadius: 3, textTransform: 'uppercase', marginBottom: 24
          }}>
            Ұлттық оқу бағдарламасы
          </div>
          <h1 style={{
            fontFamily: "'Unbounded', sans-serif", fontSize: 40, fontWeight: 700,
            color: '#fff', lineHeight: 1.12, marginBottom: 14, letterSpacing: '-.02em'
          }}>
            Кітап — білім<br /><span style={{ color: '#c9a84c' }}>қазынасы</span>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.42)', lineHeight: 1.75, marginBottom: 36 }}>
            {lang === 'kz'
              ? '6–10 сынып оқушылары, ұстаздар және бүкіл отбасы үшін ұсынылатын кітаптар.'
              : 'Рекомендуемые книги для школьников 6–10 классов, педагогов и всей семьи.'}
          </p>
          <Link href="/catalog" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: '#c9a84c', color: '#0e1c3a',
            fontFamily: "'Unbounded', sans-serif", fontSize: 12, fontWeight: 700,
            padding: '14px 32px', borderRadius: 5, letterSpacing: '.04em'
          }}>
            {lang === 'kz' ? 'Каталогты ашу' : 'Открыть каталог'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="#0e1c3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div style={{ display: 'flex', gap: 32, marginTop: 40, justifyContent: 'center' }}>
            {[['30+', lang === 'kz' ? 'кітап' : 'книг'], ['6–10', lang === 'kz' ? 'сыныптар' : 'классы'], ['3', lang === 'kz' ? 'номинация' : 'номинации']].map(([n, l]) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 20, fontWeight: 700, color: '#c9a84c' }}>{n}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shelves */}
        <div style={{ width: '100%', maxWidth: 1100, position: 'relative', zIndex: 2 }}>
          {[0, 1, 2].map(s => (
            <div key={s} style={{
              display: 'flex', alignItems: 'flex-end', gap: 5,
              padding: '12px 24px 0', position: 'relative', minHeight: 190,
              marginTop: s > 0 ? 4 : 0
            }}>
              {shelfBooks.slice(s * 10, (s + 1) * 10).map((b, i) => (
                <div key={b.id}
                  onClick={() => setSelectedBook(b)}
                  style={{
                    position: 'relative', height: SHELF_HEIGHTS[i], width: SHELF_WIDTHS[i],
                    background: b.color, borderRadius: '2px 5px 5px 2px',
                    cursor: 'pointer', flexShrink: 0,
                    boxShadow: '3px 0 10px rgba(0,0,0,0.55), inset -3px 0 5px rgba(0,0,0,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform .22s cubic-bezier(.34,1.56,.64,1)',
                    transformOrigin: 'bottom center'
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-20px) scale(1.05)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}
                >
                  <div style={{
                    writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)',
                    fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.8)',
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                    maxHeight: 130, textAlign: 'center', padding: '4px 0', width: '85%'
                  }}>
                    {b.title}
                  </div>
                </div>
              ))}
              {/* Shelf board */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 14,
                background: 'linear-gradient(180deg,#7a5610 0%,#5a3c08 50%,#3a2404 100%)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.7)'
              }} />
            </div>
          ))}
        </div>
      </section>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} lang={lang} />
      )}
    </>
  )
}
