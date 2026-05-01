'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { Book } from '@/lib/books'

type Props = {
  book: Book | null
  onClose: () => void
  lang: string
}

const RATING_LABELS: Record<number, string> = { 1: 'Так себе', 2: 'Неплохо', 3: 'Хорошо', 4: 'Отлично', 5: 'Шедевр' }
const RATING_LABELS_KZ: Record<number, string> = { 1: 'Нашар', 2: 'Жаман емес', 3: 'Жақсы', 4: 'Өте жақсы', 5: 'Шедевр' }

export default function BookModal({ book, onClose, lang }: Props) {
  const [user, setUser] = useState<any>(null)
  const [userBook, setUserBook] = useState<any>(null)
  const [status, setStatus] = useState('want')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [phase, setPhase] = useState<'opening' | 'content'>('opening')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    const t = setTimeout(() => setPhase('content'), 900)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    if (!book || !user) return
    supabase
      .from('user_books')
      .select('*')
      .eq('user_id', user.id)
      .eq('book_id', book.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setUserBook(data)
          setStatus(data.status)
          setRating(data.rating || 0)
          setReview(data.review || '')
        }
      })
  }, [book, user])

  if (!book) return null

  const desc = lang === 'kz' ? (book.descKz || book.descRu) : book.descRu
  const gradeLabel = book.grade === 'dynasty'
    ? (lang === 'kz' ? 'Оқитын Әулет' : 'Читающая Династия')
    : book.grade === 'teacher'
    ? (lang === 'kz' ? 'Оқитын Ұстаз' : 'Читающий Педагог')
    : `${book.grade} ${lang === 'kz' ? 'сынып' : 'класс'}`

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const payload = { user_id: user.id, book_id: book.id, status, rating: rating || null, review: review || null }
    if (userBook) {
      await supabase.from('user_books').update(payload).eq('id', userBook.id)
    } else {
      const { data } = await supabase.from('user_books').insert(payload).select().single()
      setUserBook(data)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const displayRating = hoverRating || rating
  const ratingLabel = displayRating ? (lang === 'kz' ? RATING_LABELS_KZ[displayRating] : RATING_LABELS[displayRating]) : ''

  const statusOpts = [
    { k: 'want',    label: lang === 'kz' ? '📚 Оқығым келеді' : '📚 Хочу прочитать', color: '#1a2d5a' },
    { k: 'reading', label: lang === 'kz' ? '📖 Оқып жатырмын' : '📖 Читаю',          color: '#c9a84c' },
    { k: 'done',    label: lang === 'kz' ? '✅ Оқып болдым'   : '✅ Прочитал(а)',      color: '#2a7a4a' },
  ]

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: phase === 'opening' ? 'rgba(4,8,16,0.95)' : 'rgba(4,8,16,0.82)',
        backdropFilter: 'blur(12px)',
        zIndex: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        transition: 'background .6s ease',
        animation: 'fadeIn .15s ease',
      }}
    >
      {/* === OPENING PHASE: cinematic book reveal === */}
      {phase === 'opening' && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 32, animation: 'fadeIn .2s ease',
        }}>
          {/* Floating book cover */}
          <div style={{ position: 'relative', animation: 'bookReveal .8s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
            {/* Glow behind cover */}
            <div style={{
              position: 'absolute', inset: -30,
              background: `radial-gradient(ellipse, ${book.color}60 0%, transparent 70%)`,
              filter: 'blur(20px)',
              animation: 'glowPulse 1s ease-in-out infinite alternate',
            }} />
            {/* Shadow pool */}
            <div style={{
              position: 'absolute', bottom: -16, left: '10%', right: '10%', height: 30,
              background: 'rgba(0,0,0,0.5)', filter: 'blur(12px)', borderRadius: '50%',
            }} />
            {/* Book */}
            <div style={{
              width: 160, height: 230,
              borderRadius: '3px 10px 10px 3px',
              overflow: 'hidden',
              boxShadow: '-6px 6px 20px rgba(0,0,0,0.6), -2px 2px 0 rgba(0,0,0,0.3), inset 4px 0 8px rgba(0,0,0,0.3)',
              position: 'relative',
            }}>
              <div style={{ width: '100%', height: '100%', background: book.color }}>
                <img src={book.cover} alt={book.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
              {/* Spine highlight */}
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 8, background: 'linear-gradient(to right, rgba(255,255,255,0.15), transparent)' }} />
              {/* Page edges */}
              <div style={{ position: 'absolute', top: 2, right: 0, bottom: 2, width: 6, background: 'repeating-linear-gradient(to bottom, #f0ede6 0px, #e8e4dc 2px)', borderRadius: '0 2px 2px 0' }} />
            </div>
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', animation: 'fadeUp .5s ease .3s both' }}>
            <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(16px,3vw,22px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 8 }}>
              {book.title}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>{book.author}</div>
          </div>

          {/* Loading dots */}
          <div style={{ display: 'flex', gap: 6, animation: 'fadeIn .3s ease .5s both' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: '#c9a84c',
                animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* === CONTENT PHASE === */}
      {phase === 'content' && (
        <div style={{
          background: '#fff',
          borderRadius: 20,
          maxWidth: 780, width: '100%',
          maxHeight: '92vh',
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
          display: 'flex',
          animation: 'modalSlideIn .4s cubic-bezier(0.34,1.2,0.64,1) forwards',
        }}>
          {/* LEFT: Large cover panel */}
          <div style={{
            width: 240, flexShrink: 0,
            background: book.color,
            position: 'relative', overflow: 'hidden',
          }}>
            <img src={book.cover} alt={book.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.6) 100%)' }} />

            {/* Bottom info */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 18px' }}>
              <div style={{
                display: 'inline-block',
                background: '#c9a84c', color: '#0e1c3a',
                borderRadius: 3, padding: '3px 10px',
                fontSize: 9, fontWeight: 700, fontFamily: "'Unbounded', sans-serif", letterSpacing: '.06em',
                marginBottom: 10,
              }}>{gradeLabel}</div>
              <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.3, textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
                {book.title}
              </div>
            </div>

            {/* Spine shimmer */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 6, background: 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' }} />
          </div>

          {/* RIGHT: Detail panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: '1px solid rgba(26,45,90,0.10)',
            }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(14,28,58,0.45)', marginBottom: 2 }}>{book.author}</div>
              </div>
              <button onClick={onClose} style={{
                background: 'rgba(14,28,58,0.06)', border: 'none', color: 'rgba(14,28,58,0.45)',
                width: 32, height: 32, borderRadius: '50%', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s',
              }}>✕</button>
            </div>

            {/* Scrollable content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 24px' }}>
              {/* Description */}
              <p style={{ fontSize: 14, color: 'rgba(26,45,90,0.7)', lineHeight: 1.8, marginBottom: 24 }}>
                {desc}
              </p>

              {user ? (
                <>
                  {/* Status */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#0e1c3a', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                      {lang === 'kz' ? 'Күй' : 'Статус'}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {statusOpts.map(({ k, label, color }) => (
                        <button key={k} onClick={() => setStatus(k)} style={{
                          padding: '7px 14px', borderRadius: 5, fontSize: 12, fontWeight: 500,
                          background: status === k ? color : '#fff',
                          color: status === k ? '#fff' : '#1a2d5a',
                          border: `1.5px solid ${status === k ? color : 'rgba(26,45,90,0.15)'}`,
                          transition: 'all .15s',
                        }}>{label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#0e1c3a', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                      {lang === 'kz' ? 'Баға' : 'Оценка'}
                      {ratingLabel && <span style={{ marginLeft: 8, fontSize: 11, color: '#c9a84c', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{ratingLabel}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n}
                          onClick={() => setRating(n === rating ? 0 : n)}
                          onMouseEnter={() => setHoverRating(n)}
                          onMouseLeave={() => setHoverRating(0)}
                          style={{
                            fontSize: 26, background: 'none', border: 'none',
                            color: n <= displayRating ? '#c9a84c' : 'rgba(14,28,58,0.18)',
                            transform: n <= displayRating ? 'scale(1.1)' : 'scale(1)',
                            transition: 'color .12s, transform .12s', lineHeight: 1,
                            padding: '0 2px',
                          }}>★</button>
                      ))}
                    </div>
                  </div>

                  {/* Review */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#0e1c3a', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                      {lang === 'kz' ? 'Пікір' : 'Отзыв'}
                    </div>
                    <textarea
                      value={review}
                      onChange={e => setReview(e.target.value)}
                      placeholder={lang === 'kz' ? 'Кітап туралы ойыңды жаз...' : 'Напиши своё впечатление о книге...'}
                      rows={3}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 6,
                        border: '1.5px solid rgba(26,45,90,0.12)', fontSize: 13,
                        color: '#0e1c3a', resize: 'vertical', outline: 'none',
                        transition: 'border-color .15s',
                      }}
                      onFocus={e => (e.target.style.borderColor = '#c9a84c')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(26,45,90,0.12)')}
                    />
                  </div>

                  <button onClick={handleSave} disabled={saving} style={{
                    display: 'block', width: '100%', textAlign: 'center',
                    background: saved ? '#2a7a4a' : '#c9a84c',
                    color: saved ? '#fff' : '#0e1c3a',
                    fontSize: 13, fontWeight: 700, fontFamily: "'Unbounded', sans-serif",
                    padding: 13, borderRadius: 8, border: 'none',
                    boxShadow: saved ? '0 4px 16px rgba(42,122,74,0.3)' : '0 4px 16px rgba(201,168,76,0.3)',
                    transition: 'all .25s', letterSpacing: '.02em',
                  }}>
                    {saved ? '✓ ' + (lang === 'kz' ? 'Сақталды!' : 'Сохранено!') : saving ? '...' : (lang === 'kz' ? 'Сөреге қосу' : 'Добавить на полку')}
                  </button>

                  {book.url && (
                    <a href={book.url} target="_blank" rel="noreferrer" style={{
                      display: 'block', textAlign: 'center', marginTop: 12,
                      fontSize: 13, color: '#c9a84c', fontWeight: 600,
                    }}>
                      {lang === 'kz' ? 'Онлайн оқу →' : 'Читать онлайн →'}
                    </a>
                  )}
                </>
              ) : (
                <div>
                  {book.url && (
                    <a href={book.url} target="_blank" rel="noreferrer" style={{
                      display: 'block', textAlign: 'center', background: '#c9a84c',
                      color: '#0e1c3a', fontSize: 13, fontWeight: 700, padding: 13, borderRadius: 8, marginBottom: 12,
                    }}>
                      {lang === 'kz' ? 'Онлайн оқу →' : 'Читать онлайн →'}
                    </a>
                  )}
                  <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(14,28,58,0.45)' }}>
                    <a href="/login" style={{ color: '#c9a84c', fontWeight: 600 }}>
                      {lang === 'kz' ? 'Кіріңіз' : 'Войди'}
                    </a>
                    {lang === 'kz' ? ', сөреге қосу үшін' : ', чтобы добавить на полку и оставить отзыв'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
