'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { Book } from '@/lib/books'

type Props = { book: Book | null; onClose: () => void; lang: string }

const RATING_LABELS: Record<number, string>    = { 1: 'Плохо', 2: 'Слабо', 3: 'Нормально', 4: 'Хорошо', 5: 'Отлично' }
const RATING_LABELS_KZ: Record<number, string> = { 1: 'Нашар', 2: 'Нашарлау', 3: 'Қалыпты', 4: 'Жақсы', 5: 'Өте жақсы' }

const GRADE_META: Record<string, { label: string; labelKz: string; color: string }> = {
  '6':     { label: '6 класс',           labelKz: '6 сынып',         color: '#2a5080' },
  '7':     { label: '7 класс',           labelKz: '7 сынып',         color: '#1e4a2a' },
  '8':     { label: '8 класс',           labelKz: '8 сынып',         color: '#5a2060' },
  '9':     { label: '9 класс',           labelKz: '9 сынып',         color: '#3a2a6a' },
  '10':    { label: '10 класс',          labelKz: '10 сынып',        color: '#7a4000' },
  dynasty: { label: 'Читающая Династия', labelKz: 'Оқитын Әулет',   color: '#9b6e22' },
  teacher: { label: 'Читающий Педагог',  labelKz: 'Оқитын Ұстаз',   color: '#1e3a2f' },
}

export default function BookModal({ book, onClose, lang }: Props) {
  const [user, setUser]       = useState<any>(null)
  const [userBook, setUserBook] = useState<any>(null)
  const [status, setStatus]   = useState('want')
  const [rating, setRating]   = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview]   = useState('')
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [phase, setPhase]     = useState<'open' | 'read'>('open')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setPhase('read'), 820)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    if (!book || !user) return
    supabase.from('user_books').select('*')
      .eq('user_id', user.id).eq('book_id', book.id).single()
      .then(({ data }) => {
        if (data) { setUserBook(data); setStatus(data.status); setRating(data.rating || 0); setReview(data.review || '') }
      })
  }, [book, user])

  if (!book) return null

  const desc = lang === 'kz' ? (book.descKz || book.descRu) : book.descRu
  const meta = GRADE_META[book.grade]
  const gradeLabel = meta ? (lang === 'kz' ? meta.labelKz : meta.label) : book.grade
  const gradeColor = meta?.color || '#555'

  const displayRating = hoverRating || rating
  const ratingLabel = displayRating ? (lang === 'kz' ? RATING_LABELS_KZ[displayRating] : RATING_LABELS[displayRating]) : ''

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
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  const statusOpts = [
    { k: 'want',    icon: '📚', label: lang === 'kz' ? 'Оқығым келеді' : 'Хочу прочитать', c: 'var(--navy)' },
    { k: 'reading', icon: '📖', label: lang === 'kz' ? 'Оқып жатырмын' : 'Читаю',          c: 'var(--gold-dark)' },
    { k: 'done',    icon: '✅', label: lang === 'kz' ? 'Оқып болдым'   : 'Прочитал(а)',     c: 'var(--forest)' },
  ]

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }} style={{
      position: 'fixed', inset: 0, zIndex: 600,
      background: 'rgba(12,10,8,.88)',
      backdropFilter: 'blur(14px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      animation: 'fadeIn .18s ease',
    }}>

      {/* ── OPENING PHASE: cinematic book reveal ── */}
      {phase === 'open' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={{ position: 'relative', animation: 'bookOpen .75s cubic-bezier(.22,1,.36,1) both', transformStyle: 'preserve-3d' }}>
            <div style={{ position: 'absolute', inset: -32, borderRadius: 24, background: `radial-gradient(ellipse, ${book.color}55, transparent 65%)`, filter: 'blur(20px)', animation: 'fadeIn .4s ease both' }} />
            <div style={{ position: 'absolute', bottom: -20, left: '15%', right: '15%', height: 24, background: 'rgba(0,0,0,.5)', filter: 'blur(14px)', borderRadius: '50%' }} />
            <div style={{ width: 160, height: 232, borderRadius: '3px 10px 10px 3px', overflow: 'hidden', boxShadow: `-8px 10px 40px rgba(0,0,0,.65), -2px 2px 0 rgba(0,0,0,.35), inset 5px 0 10px rgba(0,0,0,.25)`, position: 'relative' }}>
              <div style={{ width: '100%', height: '100%', background: book.color }}>
                <img src={book.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
              </div>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 8, background: 'linear-gradient(to right,rgba(255,255,255,.2),transparent)' }} />
              <div style={{ position: 'absolute', top: 2, right: 0, bottom: 2, width: 7, background: 'repeating-linear-gradient(to bottom,#f0ede6 0,#e0d8cc 2px)', borderRadius: '0 2px 2px 0' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center', animation: 'fadeUp .45s .25s ease both' }}>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, fontWeight: 600, color: 'rgba(245,239,230,.9)', marginBottom: 6 }}>{book.title}</div>
            <div style={{ fontSize: 13, color: 'rgba(245,239,230,.35)' }}>{book.author}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, animation: 'fadeIn .3s .5s ease both' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', animation: `floatUp 1s ${i * .2}s ease-in-out infinite` }} />
            ))}
          </div>
        </div>
      )}

      {/* ── DETAIL PANEL ── */}
      {phase === 'read' && (
        <div style={{
          background: 'var(--cream)', borderRadius: 24, maxWidth: 820, width: '100%',
          maxHeight: '92vh', overflow: 'hidden', display: 'flex',
          boxShadow: '0 40px 100px rgba(0,0,0,.55)',
          animation: 'scaleIn .3s cubic-bezier(.34,1.2,.64,1) both',
        }}>
          {/* LEFT — Cover column */}
          <div style={{ width: 280, flexShrink: 0, position: 'relative', overflow: 'hidden', background: book.color }}>
            <img src={book.cover} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,.04) 0%, rgba(0,0,0,.62) 100%)' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 8, background: 'linear-gradient(to right, rgba(255,255,255,.2), transparent)' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 10, background: 'repeating-linear-gradient(to bottom, #f0ede6 0, #ddd5c5 2px)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 20px 24px' }}>
              <div style={{ display: 'inline-block', background: gradeColor, color: '#fff', fontSize: 8.5, fontWeight: 700, fontFamily: 'var(--display)', letterSpacing: '.05em', padding: '3px 10px', borderRadius: 2, marginBottom: 12 }}>{gradeLabel}</div>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, fontWeight: 600, color: '#fff', lineHeight: 1.25, textShadow: '0 1px 10px rgba(0,0,0,.7)' }}>{book.title}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 8, fontStyle: 'italic' }}>{book.author}</div>
            </div>
          </div>

          {/* RIGHT — Detail */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Top bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 12, fontStyle: 'italic', color: 'var(--ink-light)' }}>
                {lang === 'kz' ? 'Кітап туралы' : 'О книге'}
              </div>
              <button onClick={onClose} style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(28,20,16,.07)', border: '1px solid var(--border)',
                color: 'var(--ink-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s',
              }}>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1 1l7 7M8 1L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="modal-scroll" style={{ overflowY: 'auto', padding: '22px 24px 28px', flex: 1 }}>
              <p style={{
                fontSize: 14, lineHeight: 1.9, color: 'var(--ink-mid)',
                marginBottom: 24,
                paddingLeft: 14, borderLeft: '2.5px solid var(--gold)',
              }}>{desc}</p>

              {user ? (
                <>
                  <FieldLabel>{lang === 'kz' ? 'Мәртебесі' : 'Статус'}</FieldLabel>
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 20 }}>
                    {statusOpts.map(s => (
                      <button key={s.k} onClick={() => setStatus(s.k)} style={{
                        padding: '7px 13px', borderRadius: 6, fontSize: 11.5, fontWeight: 500,
                        background: status === s.k ? s.c : 'transparent',
                        color: status === s.k ? '#fff' : 'var(--ink-mid)',
                        border: `1.5px solid ${status === s.k ? s.c : 'var(--border)'}`,
                        transition: 'all .15s',
                      }}>{s.icon} {s.label}</button>
                    ))}
                  </div>

                  <FieldLabel>
                    {lang === 'kz' ? 'Баға' : 'Оценка'}
                    {ratingLabel && <span style={{ marginLeft: 8, color: 'var(--gold)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{ratingLabel}</span>}
                  </FieldLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 20 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n}
                        onMouseEnter={() => setHoverRating(n)} onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(n === rating ? 0 : n)}
                        style={{
                          fontSize: 26, lineHeight: 1, padding: '0 2px',
                          color: n <= displayRating ? 'var(--gold)' : 'rgba(28,20,16,.12)',
                          transform: n <= displayRating ? 'scale(1.15)' : 'scale(1)',
                          transition: 'all .1s',
                        }}>★</button>
                    ))}
                  </div>

                  <FieldLabel>{lang === 'kz' ? 'Пікір' : 'Отзыв'}</FieldLabel>
                  <textarea value={review} onChange={e => setReview(e.target.value)} rows={3}
                    placeholder={lang === 'kz' ? 'Пікіріңізді жазыңыз...' : 'Поделись впечатлением о книге...'}
                    style={{
                      width: '100%', padding: '11px 13px', borderRadius: 8, resize: 'none', outline: 'none',
                      border: '1.5px solid var(--border)', fontSize: 13, color: 'var(--ink)', lineHeight: 1.75,
                      background: 'var(--paper)', marginBottom: 20, transition: 'border-color .15s',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')} />

                  <button onClick={handleSave} disabled={saving} style={{
                    display: 'block', width: '100%', textAlign: 'center',
                    padding: '13px', borderRadius: 9, fontSize: 12, fontWeight: 700, fontFamily: 'var(--display)', letterSpacing: '.04em',
                    background: saved ? 'linear-gradient(135deg,#1e5a38,#2a7a4a)' : 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                    color: saved ? '#fff' : 'var(--ink)',
                    border: 'none', cursor: saving ? 'wait' : 'pointer',
                    boxShadow: saved ? '0 4px 16px rgba(30,90,56,.3)' : '0 4px 20px rgba(200,150,62,.3)',
                    transition: 'all .3s',
                  }}>
                    {saved ? `✓ ${lang === 'kz' ? 'Сақталды!' : 'Сохранено!'}` : saving ? '...' : (lang === 'kz' ? 'Жапсырмаға қосу' : 'Добавить на полку')}
                  </button>

                  {book.url && (
                    <a href={book.url} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>
                      {lang === 'kz' ? 'Онлайн оқу →' : 'Читать онлайн →'}
                    </a>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', paddingTop: 8 }}>
                  {book.url && (
                    <a href={book.url} target="_blank" rel="noreferrer" style={{
                      display: 'block', marginBottom: 14,
                      background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                      color: 'var(--ink)', fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700,
                      padding: '13px', borderRadius: 9, letterSpacing: '.04em',
                      boxShadow: '0 4px 20px rgba(200,150,62,.3)',
                    }}>
                      {lang === 'kz' ? 'Онлайн оқу →' : 'Читать онлайн →'}
                    </a>
                  )}
                  <div style={{ fontSize: 13, color: 'var(--ink-light)', lineHeight: 1.7 }}>
                    <a href="/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>
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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 9 }}>{children}</div>
}
