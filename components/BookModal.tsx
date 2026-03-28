'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { Book } from '@/lib/books'

type Props = {
  book: Book | null
  onClose: () => void
  lang: string
}

const STATUS_LABELS: Record<string, string> = {
  want: '📚 Хочу прочитать',
  reading: '📖 Читаю',
  done: '✅ Прочитал(а)',
}

export default function BookModal({ book, onClose, lang }: Props) {
  const [user, setUser] = useState<any>(null)
  const [userBook, setUserBook] = useState<any>(null)
  const [status, setStatus] = useState('want')
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
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

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const payload = { user_id: user.id, book_id: book.id, status, rating: rating || null, review: review || null }
    if (userBook) {
      await supabase.from('user_books').update(payload).eq('id', userBook.id)
    } else {
      await supabase.from('user_books').insert(payload)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const desc = lang === 'kz' ? book.descKz : book.descRu

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
      zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, maxWidth: 500, width: '100%',
        maxHeight: '92vh', overflowY: 'auto', position: 'relative'
      }}>
        {/* Top cover */}
        <div style={{
          height: 200, background: book.color, position: 'relative',
          overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: 20, flexShrink: 0
        }}>
          <img src={book.cover} alt={book.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-block', background: '#c9a84c', color: '#0e1c3a',
              borderRadius: 3, padding: '2px 8px', fontSize: 9, fontWeight: 600, marginBottom: 8
            }}>
              {book.grade === 'dynasty' ? 'Читающая династия' : book.grade === 'teacher' ? 'Читающий педагог' : `${book.grade} класс`}
            </div>
            <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
              {book.title}
            </div>
          </div>
          <button onClick={onClose} style={{
            position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,0.45)',
            border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%',
            fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{ fontSize: 12, color: 'rgba(14,28,58,0.4)', marginBottom: 12 }}>
            Автор: {book.author}
          </div>
          <div style={{ fontSize: 14, color: '#2a3a5a', lineHeight: 1.8, marginBottom: 20 }}>
            {desc}
          </div>

          {/* User actions */}
          {user ? (
            <div style={{ borderTop: '1px solid rgba(14,28,58,0.1)', paddingTop: 20 }}>
              {/* Status */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0e1c3a', marginBottom: 8 }}>Статус</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <button key={k} onClick={() => setStatus(k)} style={{
                      padding: '6px 14px', borderRadius: 4, fontSize: 12, fontWeight: 500,
                      background: status === k ? '#1a2d5a' : '#fff',
                      color: status === k ? '#fff' : '#1a2d5a',
                      border: `1px solid ${status === k ? '#1a2d5a' : 'rgba(26,45,90,0.15)'}`,
                      transition: 'all .15s'
                    }}>{v}</button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0e1c3a', marginBottom: 8 }}>Оценка</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setRating(n === rating ? 0 : n)} style={{
                      fontSize: 24, background: 'none', border: 'none',
                      color: n <= rating ? '#c9a84c' : 'rgba(14,28,58,0.2)',
                      transition: 'color .15s', lineHeight: 1
                    }}>★</button>
                  ))}
                </div>
              </div>

              {/* Review */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0e1c3a', marginBottom: 8 }}>Отзыв</div>
                <textarea
                  value={review}
                  onChange={e => setReview(e.target.value)}
                  placeholder="Напиши своё впечатление о книге..."
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 6,
                    border: '1px solid rgba(14,28,58,0.15)', fontSize: 13,
                    color: '#0e1c3a', resize: 'vertical', outline: 'none'
                  }}
                />
              </div>

              <button onClick={handleSave} disabled={saving} style={{
                display: 'block', width: '100%', textAlign: 'center',
                background: saved ? '#2a7a4a' : '#c9a84c',
                color: saved ? '#fff' : '#0e1c3a',
                fontSize: 13, fontWeight: 700, padding: 13, borderRadius: 7,
                border: 'none', transition: 'background .2s'
              }}>
                {saved ? '✓ Сохранено!' : saving ? 'Сохраняю...' : 'Добавить на полку'}
              </button>
            </div>
          ) : (
            <div>
              <a href={book.url} target="_blank" rel="noreferrer" style={{
                display: 'block', textAlign: 'center', background: '#c9a84c',
                color: '#0e1c3a', fontSize: 13, fontWeight: 700, padding: 13, borderRadius: 7, marginBottom: 12
              }}>
                Читать онлайн →
              </a>
              <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(14,28,58,0.45)' }}>
                <a href="/login" style={{ color: '#c9a84c', fontWeight: 600 }}>Войди</a>, чтобы добавить на полку и оставить отзыв
              </div>
            </div>
          )}

          {user && book.url && (
            <a href={book.url} target="_blank" rel="noreferrer" style={{
              display: 'block', textAlign: 'center', marginTop: 12,
              fontSize: 13, color: '#c9a84c', fontWeight: 600
            }}>
              Читать онлайн →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
