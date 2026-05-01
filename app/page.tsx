'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import BookModal from '@/components/BookModal'
import { BOOKS, type Book } from '@/lib/books'

const GRADE_COLORS: Record<string, string> = {
  '6': '#2a5080', '7': '#1e4a2a', '8': '#5a2060',
  '9': '#3a2a6a', '10': '#7a4000', dynasty: '#9b6e22', teacher: '#1e3a2f',
}

export default function Home() {
  const [lang, setLang] = useState('ru')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const featured = BOOKS[0]
  const picks    = BOOKS.slice(1, 5)
  const recent   = BOOKS.slice(5, 11)

  const totalBooks = BOOKS.length

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #12100E 0%, #1C1410 45%, #241A0E 100%)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Decorative big letter */}
        <div style={{
          position: 'absolute', top: '-5%', right: '-2%',
          fontFamily: 'var(--serif)', fontSize: 'clamp(280px, 28vw, 420px)',
          fontWeight: 700, fontStyle: 'italic',
          color: 'rgba(200,150,62,0.05)',
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
          letterSpacing: '-.04em',
        }}>К</div>

        {/* Gold rule below navbar */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, var(--gold) 30%, var(--gold-light) 50%, var(--gold) 70%, transparent)', position: 'absolute', top: 62, left: 0, right: 0 }} />

        {/* Main content */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          padding: '100px clamp(1.5rem, 5vw, 4rem) 80px',
          maxWidth: 1360, margin: '0 auto', width: '100%',
          gap: 'clamp(2rem, 5vw, 5rem)',
        }}>
          {/* LEFT: Editorial text */}
          <div style={{ flex: '0 0 auto', maxWidth: 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, animation: 'fadeUp .4s ease both' }}>
              <div style={{ height: 1, width: 32, background: 'var(--gold)' }} />
              <span style={{ fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 500, letterSpacing: '.18em', color: 'var(--gold)', textTransform: 'uppercase' }}>
                {lang === 'kz' ? 'Ұлттық оқу бағдарламасы' : 'Национальная программа чтения'}
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)',
              fontWeight: 700, fontStyle: 'italic',
              color: '#F5EFE6',
              lineHeight: 1.05, letterSpacing: '-.02em',
              marginBottom: 12,
              animation: 'fadeUp .4s .05s ease both',
            }}>
              Читай.<br />
              <span style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Думай.</span><br />
              Расти.
            </h1>

            <p style={{
              fontSize: 'clamp(14px, 1.6vw, 16px)',
              color: 'rgba(245,239,230,0.42)',
              lineHeight: 1.85, marginBottom: 40, maxWidth: 400,
              animation: 'fadeUp .4s .10s ease both',
            }}>
              {lang === 'kz'
                ? 'Балаларға, ұстаздарға және бүкіл отбасына арналған кітаптар жинағы.'
                : 'Рекомендуемые книги для школьников 6–10 классов, педагогов и всей семьи Казахстана.'}
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 56, animation: 'fadeUp .4s .18s ease both' }}>
              <Link href="/catalog" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #C8963E, #9B6E22)',
                color: '#1C1410', fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700, letterSpacing: '.05em',
                padding: '13px 26px', borderRadius: 6, border: 'none',
                boxShadow: '0 3px 18px rgba(200,150,62,.3)',
              }}>
                {lang === 'kz' ? 'Каталогты ашу' : 'Открыть каталог'}
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div style={{ display: 'flex', gap: 40, animation: 'fadeUp .4s .26s ease both' }}>
              {[
                [String(totalBooks), lang === 'kz' ? 'кітап' : 'книг'],
                ['6–10', lang === 'kz' ? 'сыныптар' : 'классы'],
                ['3', lang === 'kz' ? 'номинация' : 'номинации'],
              ].map(([n, l]) => (
                <div key={n}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 2.8vw, 30px)', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 11, color: 'rgba(245,239,230,.3)', marginTop: 5, letterSpacing: '.06em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Featured + picks */}
          <div style={{ flex: 1, display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'center', animation: 'fadeUp .4s .10s ease both' }}>
            {/* Featured book */}
            <FeaturedBookCard book={featured} onBookClick={setSelectedBook} />

            {/* Mini picks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 32 }}>
              {picks.map((b, i) => (
                <MiniBookCard key={b.id} book={b} delay={i * 60} onBookClick={setSelectedBook} />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ textAlign: 'center', padding: '0 0 32px', animation: 'floatUp 2.4s ease-in-out infinite' }}>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, rgba(200,150,62,.5))', margin: '0 auto 8px' }} />
          <span style={{ fontSize: 9, letterSpacing: '.16em', color: 'rgba(255,255,255,.2)', textTransform: 'uppercase' }}>
            {lang === 'kz' ? 'Төмен қарай' : 'Листать'}
          </span>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ background: 'var(--paper)', padding: '80px clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto' }}>
          <SectionHeader
            eyebrow={lang === 'kz' ? 'Санаттар бойынша' : 'По категориям'}
            title={lang === 'kz' ? 'Барлық оқушыларға' : 'Для каждого возраста'}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 36 }}>
            {Object.keys(GRADE_COLORS).map(grade => {
              const count = BOOKS.filter(b => b.grade === grade).length
              const label = grade === 'dynasty'
                ? (lang === 'kz' ? 'Оқитын Әулет' : 'Читающая Династия')
                : grade === 'teacher'
                ? (lang === 'kz' ? 'Оқитын Ұстаз' : 'Читающий Педагог')
                : `${grade} ${lang === 'kz' ? 'сынып' : 'класс'}`
              return (
                <GradePill key={grade} color={GRADE_COLORS[grade]} label={label} count={count} />
              )
            })}
          </div>
        </div>
      </section>

      {/* ── POPULAR ── */}
      <section style={{ background: 'var(--paper-dark)', padding: '80px clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto' }}>
          <SectionHeader
            eyebrow={lang === 'kz' ? 'Жиі оқылады' : 'Популярные'}
            title={lang === 'kz' ? 'Оқырмандар таңдауы' : 'Выбор читателей'}
            action={{ label: lang === 'kz' ? 'Барлығын көру →' : 'Смотреть все →', href: '/catalog' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 20, marginTop: 36 }}>
            {recent.map((b, i) => (
              <CatalogCard key={b.id} book={b} lang={lang} index={i} onBookClick={setSelectedBook} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ABAY QUOTE BANNER ── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #0E1628 100%)',
        padding: '80px clamp(1.5rem, 5vw, 4rem)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -80, top: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,150,62,.08), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 64, color: 'var(--gold)', opacity: .35, lineHeight: 1, marginBottom: -20 }}>"</div>
          <blockquote style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 'clamp(1.3rem, 2.8vw, 2rem)',
            color: 'rgba(245,239,230,.85)', lineHeight: 1.6, marginBottom: 24,
          }}>
            {lang === 'kz'
              ? 'Кітап — адамзаттың рухани байлығы, ол ұрпақтан ұрпаққа беріліп отырады.'
              : 'Книга — духовное завещание одного поколения другому.'}
          </blockquote>
          <cite style={{ fontSize: 12, letterSpacing: '.12em', color: 'var(--gold)', textTransform: 'uppercase', fontStyle: 'normal' }}>
            {lang === 'kz' ? '— Абай Құнанбаев' : '— Абай Кунанбаев'}
          </cite>
        </div>
      </section>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} lang={lang} />
      )}
    </>
  )
}

function FeaturedBookCard({ book, onBookClick }: { book: Book; onBookClick: (b: Book) => void }) {
  const [hov, setHov] = useState(false)
  return (
    <div onClick={() => onBookClick(book)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', cursor: 'pointer',
        animation: 'fadeUp .5s .15s ease both',
        transition: 'transform .3s cubic-bezier(.34,1.56,.64,1)',
        transform: hov ? 'translateY(-10px) rotate(-1deg)' : 'none',
      }}>
      <div style={{
        position: 'absolute', inset: -20, zIndex: 0, borderRadius: 20,
        background: `radial-gradient(ellipse at center, ${book.color}50, transparent 70%)`,
        filter: 'blur(16px)', opacity: hov ? 1 : .6, transition: 'opacity .3s',
      }} />
      <div style={{
        position: 'relative', zIndex: 1,
        width: 180, height: 262,
        borderRadius: '3px 10px 10px 3px',
        overflow: 'hidden',
        boxShadow: '-8px 8px 30px rgba(0,0,0,0.65), -2px 2px 0 rgba(0,0,0,0.3), inset 4px 0 8px rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ width: '100%', height: '100%', background: book.color }}>
          <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s', transform: hov ? 'scale(1.04)' : 'scale(1)' }} onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 8, background: 'linear-gradient(to right,rgba(255,255,255,.18),transparent)' }} />
        <div style={{ position: 'absolute', top: 2, right: 0, bottom: 2, width: 7, background: 'repeating-linear-gradient(to bottom, #f0ede6 0px, #e0d8cc 2px)', borderRadius: '0 2px 2px 0' }} />
      </div>
      <div style={{ position: 'absolute', bottom: -44, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.75)', lineHeight: 1.3 }}>{book.title}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginTop: 3 }}>{book.author}</div>
      </div>
    </div>
  )
}

function MiniBookCard({ book, delay, onBookClick }: { book: Book; delay: number; onBookClick: (b: Book) => void }) {
  const [hov, setHov] = useState(false)
  return (
    <div onClick={() => onBookClick(book)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
        padding: '10px 14px', borderRadius: 10,
        background: hov ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'all .18s',
        animation: `fadeUp .4s ${delay}ms ease both`,
        width: 220,
      }}>
      <div style={{
        width: 36, height: 52, borderRadius: 3, overflow: 'hidden',
        background: book.color, flexShrink: 0,
        boxShadow: '-2px 2px 8px rgba(0,0,0,0.5)',
      }}>
        <img src={book.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(245,239,230,.8)', lineHeight: 1.3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{book.title}</div>
        <div style={{ fontSize: 10, color: 'rgba(245,239,230,.3)', marginTop: 2 }}>{book.author}</div>
      </div>
    </div>
  )
}

function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: { label: string; href: string } }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.18em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>{eyebrow}</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, fontStyle: 'italic', color: 'var(--ink)', letterSpacing: '-.01em', lineHeight: 1.15 }}>{title}</h2>
      </div>
      {action && (
        <Link href={action.href} style={{ fontSize: 13, color: 'var(--gold-dark)', fontWeight: 500, borderBottom: '1px solid var(--gold-dark)', paddingBottom: 2 }}>
          {action.label}
        </Link>
      )}
    </div>
  )
}

function GradePill({ color, label, count }: { color: string; label: string; count: number }) {
  const [hov, setHov] = useState(false)
  return (
    <Link href="/catalog"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: '20px', borderRadius: 12, cursor: 'pointer', display: 'block',
        background: 'var(--cream)',
        border: `1.5px solid ${hov ? color : 'var(--border)'}`,
        boxShadow: hov ? `0 6px 24px ${color}22` : '0 1px 4px rgba(28,20,16,0.05)',
        transition: 'all .2s',
        transform: hov ? 'translateY(-3px)' : 'none',
      }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, marginBottom: 12 }} />
      <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{count} кітап</div>
    </Link>
  )
}

function CatalogCard({ book, lang, index, onBookClick }: { book: Book; lang: string; index: number; onBookClick: (b: Book) => void }) {
  const [hov, setHov] = useState(false)
  const gradeColor = GRADE_COLORS[book.grade] || '#333'
  const gradeLabel = book.grade === 'dynasty'
    ? (lang === 'kz' ? 'Әулет' : 'Династия')
    : book.grade === 'teacher'
    ? (lang === 'kz' ? 'Ұстаз' : 'Педагог')
    : `${book.grade} ${lang === 'kz' ? 'сынып' : 'кл'}`

  return (
    <div onClick={() => onBookClick(book)}
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
        <div style={{ position: 'absolute', top: 10, left: 10, background: gradeColor, color: '#fff', fontSize: 8.5, fontWeight: 600, fontFamily: 'var(--display)', letterSpacing: '.04em', padding: '2px 8px', borderRadius: 2 }}>{gradeLabel}</div>
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
