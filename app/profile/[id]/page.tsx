'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import BookModal from '@/components/BookModal'
import { createClient } from '@/lib/supabase'
import { BOOKS, type Book } from '@/lib/books'

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  want:    { label: '📚 Хочу прочитать', color: 'var(--navy)',      bg: 'rgba(26,39,68,.1)' },
  reading: { label: '📖 Читаю',          color: 'var(--gold-dark)', bg: 'rgba(155,110,34,.1)' },
  done:    { label: '✅ Прочитал(а)',     color: 'var(--forest)',    bg: 'rgba(30,58,47,.1)' },
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [lang] = useState('ru')
  const [profile, setProfile] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userBooks, setUserBooks] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'want' | 'reading' | 'done'>('all')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [friendStatus, setFriendStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', id).single()
      setProfile(prof)

      const { data: books } = await supabase.from('user_books').select('*').eq('user_id', id)
      setUserBooks(books || [])

      if (user && user.id !== id) {
        const { data: fs } = await supabase.from('friendships').select('*')
          .or(`and(requester_id.eq.${user.id},receiver_id.eq.${id}),and(requester_id.eq.${id},receiver_id.eq.${user.id})`)
          .single()
        setFriendStatus(fs?.status || null)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const sendFriendRequest = async () => {
    if (!currentUser) return
    await supabase.from('friendships').insert({ requester_id: currentUser.id, receiver_id: id })
    setFriendStatus('pending')
  }

  const acceptFriend = async () => {
    if (!currentUser) return
    await supabase.from('friendships').update({ status: 'accepted' })
      .eq('requester_id', id).eq('receiver_id', currentUser.id)
    setFriendStatus('accepted')
  }

  const filteredBooks = userBooks.filter(ub => activeTab === 'all' || ub.status === activeTab)
  const getBook = (bookId: string) => BOOKS.find(b => b.id === bookId)
  const isOwn = currentUser?.id === id

  const counts = {
    all:     userBooks.length,
    want:    userBooks.filter(b => b.status === 'want').length,
    reading: userBooks.filter(b => b.status === 'reading').length,
    done:    userBooks.filter(b => b.status === 'done').length,
  }

  if (loading) return (
    <>
      <Navbar lang={lang} />
      <div style={{ paddingTop: 62, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--paper)' }}>
        <div style={{ color: 'var(--ink-faint)', fontSize: 14, fontFamily: 'var(--serif)', fontStyle: 'italic' }}>Загружаем профиль...</div>
      </div>
    </>
  )

  return (
    <>
      <Navbar lang={lang} />
      <div style={{ paddingTop: 62, minHeight: '100vh', background: 'var(--paper)' }}>

        {/* Profile header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--navy) 0%, #0E1628 100%)',
          padding: '52px clamp(1.5rem, 5vw, 4rem) 48px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -40, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(200,150,62,.08),transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
              {/* Avatar */}
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 700, color: 'var(--ink)',
                boxShadow: '0 0 0 4px rgba(200,150,62,.2), 0 8px 30px rgba(0,0,0,.4)',
                flexShrink: 0,
              }}>
                {profile?.full_name?.[0]?.toUpperCase() || '?'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700, color: '#F5EFE6', marginBottom: 4 }}>
                  {profile?.full_name || 'Пользователь'}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(245,239,230,.35)' }}>
                  {counts.all} {lang === 'kz' ? 'кітап сөреде' : 'книг на полке'}
                </div>
              </div>

              {/* Friend button */}
              {!isOwn && currentUser && (
                friendStatus === 'accepted' ? (
                  <div style={{ background: 'rgba(200,150,62,.12)', color: 'var(--gold)', padding: '8px 20px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid rgba(200,150,62,.25)' }}>✓ Друзья</div>
                ) : friendStatus === 'pending' ? (
                  <div style={{ background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.4)', padding: '8px 20px', borderRadius: 6, fontSize: 12, border: '1px solid rgba(255,255,255,.1)' }}>Запрос отправлен</div>
                ) : (
                  <button onClick={sendFriendRequest} style={{
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                    color: 'var(--ink)', fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700,
                    padding: '8px 20px', borderRadius: 6, border: 'none',
                    boxShadow: '0 2px 14px rgba(200,150,62,.3)',
                  }}>+ Добавить в друзья</button>
                )
              )}
              {!isOwn && !currentUser && (
                <Link href="/login" style={{
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                  color: 'var(--ink)', fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700,
                  padding: '8px 20px', borderRadius: 6, boxShadow: '0 2px 14px rgba(200,150,62,.3)',
                }}>Войти</Link>
              )}
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[
                [counts.want,    lang === 'kz' ? 'оқығым келеді' : 'хочу прочитать'],
                [counts.reading, lang === 'kz' ? 'оқып жатырмын' : 'читаю сейчас'],
                [counts.done,    lang === 'kz' ? 'оқып болдым'   : 'прочитал(а)'],
              ].map(([n, l], i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 11, color: 'rgba(245,239,230,.3)', marginTop: 4 }}>{l as string}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Books */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px clamp(1.5rem, 5vw, 4rem) 80px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 32, flexWrap: 'wrap' }}>
            {(['all', 'want', 'reading', 'done'] as const).map(k => {
              const labels: Record<string, string> = {
                all:     lang === 'kz' ? 'Барлығы'         : 'Все',
                want:    lang === 'kz' ? 'Оқығым келеді'   : 'Хочу',
                reading: lang === 'kz' ? 'Оқып жатырмын'   : 'Читаю',
                done:    lang === 'kz' ? 'Оқып болдым'     : 'Прочитал(а)',
              }
              return (
                <button key={k} onClick={() => setActiveTab(k)} style={{
                  padding: '7px 18px', borderRadius: 20, fontSize: 12, fontWeight: activeTab === k ? 500 : 400,
                  background: activeTab === k ? 'var(--ink)' : 'transparent',
                  color: activeTab === k ? '#fff' : 'var(--ink-light)',
                  border: `1px solid ${activeTab === k ? 'var(--ink)' : 'var(--border)'}`,
                  transition: 'all .15s',
                }}>
                  {labels[k]} <span style={{ opacity: .6 }}>({counts[k]})</span>
                </button>
              )
            })}
          </div>

          {filteredBooks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 48, color: 'var(--paper-deep)', marginBottom: 16, fontStyle: 'italic' }}>◇</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}>
                {isOwn ? 'Добавь первую книгу' : 'Здесь пока пусто'}
              </div>
              {isOwn && (
                <div style={{ marginTop: 16 }}>
                  <Link href="/catalog" style={{
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                    color: 'var(--ink)', fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700,
                    padding: '10px 24px', borderRadius: 6, boxShadow: '0 2px 14px rgba(200,150,62,.3)',
                  }}>Перейти в каталог</Link>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 28 }}>
              {filteredBooks.map(ub => {
                const book = getBook(ub.book_id)
                if (!book) return null
                const sm = STATUS_META[ub.status] || STATUS_META.want
                return (
                  <LibraryBookCard key={ub.id} book={book} ub={ub} sm={sm} onClick={() => setSelectedBook(book)} />
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

function LibraryBookCard({ book, ub, sm, onClick }: { book: Book; ub: any; sm: { label: string; color: string; bg: string }; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ cursor: 'pointer' }}>
      <div style={{
        position: 'relative', marginBottom: 14,
        transform: hov ? 'translateY(-8px) rotate(-1.5deg)' : 'none',
        transition: 'transform .25s cubic-bezier(.34,1.4,.64,1)',
      }}>
        <div style={{ position: 'absolute', bottom: -10, left: '10%', right: '10%', height: 18, background: 'rgba(28,20,16,.18)', filter: 'blur(8px)', borderRadius: '50%', transition: 'transform .25s', transform: hov ? 'scaleX(0.9)' : 'scaleX(1)' }} />
        <div style={{
          height: 240, borderRadius: '3px 10px 10px 3px', overflow: 'hidden', background: book.color,
          boxShadow: hov ? `-8px 12px 32px rgba(0,0,0,.22), 0 0 0 1.5px ${sm.color}44` : '-4px 6px 16px rgba(0,0,0,.15)',
          transition: 'box-shadow .25s', position: 'relative',
        }}>
          <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s', transform: hov ? 'scale(1.04)' : 'scale(1)' }} onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,16,14,.6) 0%, transparent 50%)' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 6, background: 'linear-gradient(to right,rgba(255,255,255,.18),transparent)' }} />
          <div style={{ position: 'absolute', top: 2, right: 0, bottom: 2, width: 6, background: 'repeating-linear-gradient(to bottom,#f0ede6 0,#e0d8cc 2px)', borderRadius: '0 2px 2px 0' }} />
          {ub.rating > 0 && (
            <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', gap: 1 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <span key={n} style={{ fontSize: 10, color: n <= ub.rating ? 'var(--gold-light)' : 'rgba(255,255,255,.2)' }}>★</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 5 }}>{book.title}</div>
      <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 8 }}>{book.author}</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: sm.bg, color: sm.color, fontSize: 10, fontWeight: 500, padding: '3px 9px', borderRadius: 3 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: sm.color }} />
        {sm.label.replace(/^[^\s]+\s/, '')}
      </div>
      {ub.review && <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-light)', fontStyle: 'italic', lineHeight: 1.6 }}>«{ub.review}»</div>}
    </div>
  )
}
