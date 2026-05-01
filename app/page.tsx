'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import BookModal from '@/components/BookModal'
import { BOOKS, type Book } from '@/lib/books'

const FLOAT_POSITIONS = [
  { top: '5%',  left: '8%',  w: 110, h: 160, rot: '-6deg', anim: 'floatA 6s ease-in-out infinite',        zIndex: 3 },
  { top: '0%',  left: '30%', w: 130, h: 190, rot: '2deg',  anim: 'floatB 7s ease-in-out infinite',        zIndex: 5 },
  { top: '8%',  left: '58%', w: 115, h: 168, rot: '-3deg', anim: 'floatC 5.5s ease-in-out infinite',      zIndex: 4 },
  { top: '48%', left: '2%',  w: 100, h: 148, rot: '4deg',  anim: 'floatB 8s ease-in-out infinite 1s',     zIndex: 2 },
  { top: '44%', left: '36%', w: 125, h: 182, rot: '-2deg', anim: 'floatA 6.5s ease-in-out infinite .5s',  zIndex: 6 },
  { top: '50%', left: '66%', w: 108, h: 158, rot: '5deg',  anim: 'floatC 7.5s ease-in-out infinite .8s',  zIndex: 3 },
]

export default function Home() {
  const [lang, setLang] = useState('ru')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const featured = BOOKS.slice(0, 6)

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #040810 0%, #080d1e 40%, #0c1528 70%, #0e1c38 100%)',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(26,45,90,0.4) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '40%', right: '30%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Main content */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          padding: '100px clamp(1.5rem, 5vw, 5rem) 80px',
          maxWidth: 1300, margin: '0 auto', width: '100%',
          gap: 'clamp(2rem, 6vw, 6rem)',
        }}>
          {/* Left: text */}
          <div style={{ flex: '0 0 auto', maxWidth: 520, animation: 'fadeUp .6s ease forwards', position: 'relative', zIndex: 10 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 4,
              padding: '6px 14px',
              marginBottom: 32,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a84c', animation: 'pulse 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '.14em', color: '#c9a84c', textTransform: 'uppercase' }}>
                Ұлттық оқу бағдарламасы
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-.03em',
              marginBottom: 24,
            }}>
              Кітап —{' '}
              <span style={{
                background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>білім</span>
              <br />қазынасы
            </h1>

            <p style={{
              fontSize: 'clamp(14px, 1.8vw, 16px)',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.8,
              marginBottom: 40,
              maxWidth: 440,
            }}>
              {lang === 'kz'
                ? '6–10 сынып оқушылары, ұстаздар және бүкіл отбасы үшін ұсынылатын кітаптар.'
                : 'Рекомендуемые книги для школьников 6–10 классов, педагогов и всей семьи Казахстана.'}
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 56 }}>
              <Link href="/catalog" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'linear-gradient(135deg, #c9a84c, #a07830)',
                color: '#0e1c3a',
                fontFamily: "'Unbounded', sans-serif", fontSize: 12, fontWeight: 700,
                padding: '14px 28px', borderRadius: 6,
                boxShadow: '0 4px 24px rgba(201,168,76,0.35)',
                letterSpacing: '.03em',
              }}>
                {lang === 'kz' ? 'Каталогты ашу' : 'Открыть каталог'}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7h9M8 3.5l3.5 3.5-3.5 3.5" stroke="#0e1c3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 32 }}>
              {[
                ['30+', lang === 'kz' ? 'кітап' : 'книг'],
                ['6–10', lang === 'kz' ? 'сыныптар' : 'классы'],
                ['3', lang === 'kz' ? 'номинация' : 'номинации'],
              ].map(([n, l]) => (
                <div key={n}>
                  <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 700, color: '#c9a84c', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4, letterSpacing: '.04em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating book covers */}
          <div style={{ flex: 1, position: 'relative', height: 480, minWidth: 0, display: 'none' }} className="hero-books-panel">
            <FloatingBooks books={featured} onBookClick={setSelectedBook} />
          </div>
        </div>

        {/* Floating books for wide screens — absolute positioned */}
        <div style={{
          position: 'absolute', right: 'clamp(2rem, 8vw, 8rem)',
          top: '50%', transform: 'translateY(-50%)',
          width: 'min(480px, 40vw)', height: 480,
        }}>
          <FloatingBooks books={featured} onBookClick={setSelectedBook} />
        </div>

        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, #f5f3ee, transparent)', pointerEvents: 'none' }} />
      </section>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} lang={lang} />
      )}
    </>
  )
}

function FloatingBooks({ books, onBookClick }: { books: Book[]; onBookClick: (b: Book) => void }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {books.slice(0, 6).map((book, i) => {
        const p = FLOAT_POSITIONS[i]
        return (
          <div
            key={book.id}
            onClick={() => onBookClick(book)}
            style={{
              position: 'absolute',
              top: p.top, left: p.left,
              width: p.w, height: p.h,
              borderRadius: 6,
              overflow: 'hidden',
              cursor: 'pointer',
              animation: p.anim,
              zIndex: p.zIndex,
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'transform .2s ease, box-shadow .2s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = 'scale(1.06)'
              el.style.boxShadow = '0 28px 80px rgba(0,0,0,0.7), 0 0 0 2px #c9a84c'
              el.style.zIndex = '10'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = ''
              el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4)'
              el.style.zIndex = String(p.zIndex)
            }}
          >
            <div style={{ width: '100%', height: '100%', background: book.color }}>
              <img
                src={book.cover} alt={book.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
