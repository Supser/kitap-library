'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import BookModal from '@/components/BookModal'
import { createClient } from '@/lib/supabase'
import { BOOKS, type Book } from '@/lib/books'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  want:    { label: '📚 Хочу прочитать', color: '#1a2d5a' },
  reading: { label: '📖 Читаю',          color: '#c9a84c' },
  done:    { label: '✅ Прочитал(а)',     color: '#2a7a4a' },
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

  if (loading) return (
    <>
      <Navbar lang={lang} />
      <div style={{ paddingTop: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: 'rgba(14,28,58,0.4)', fontSize: 14 }}>Загружаем профиль...</div>
      </div>
    </>
  )

  return (
    <>
      <Navbar lang={lang} />
      <div style={{ paddingTop: 64, minHeight: '100vh', background: '#f5f3ee' }}>

        {/* Profile header */}
        <div style={{
          background: 'linear-gradient(135deg, #06080f 0%, #1a2d5a 100%)',
          padding: '56px clamp(1.5rem, 4vw, 2.5rem) 48px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative orbs */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(201,168,76,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -40, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            {/* Avatar */}
            <div style={{
              width: 84, height: 84, borderRadius: '50%',
              background: 'linear-gradient(135deg, #c9a84c, #a07830)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Unbounded', sans-serif", fontSize: 30, fontWeight: 700, color: '#0e1c3a',
              boxShadow: '0 0 0 4px rgba(201,168,76,0.2), 0 8px 32px rgba(0,0,0,0.4)',
              flexShrink: 0,
            }}>
              {profile?.full_name?.[0]?.toUpperCase() || '?'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 700, color: '#fff', letterSpacing: '-.01em', marginBottom: 6 }}>
                {profile?.full_name || 'Пользователь'}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
                {userBooks.length} {lang === 'kz' ? 'кітап сөреде' : 'книг на полке'}
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                {[
                  [userBooks.filter(b => b.status === 'want').length,    lang === 'kz' ? 'оқығым келеді' : 'хочу'],
                  [userBooks.filter(b => b.status === 'reading').length,  lang === 'kz' ? 'оқып жатырмын' : 'читаю'],
                  [userBooks.filter(b => b.status === 'done').length,     lang === 'kz' ? 'оқып болдым' : 'прочитал'],
                ].map(([n, l], i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, color: '#c9a84c', lineHeight: 1 }}>{n}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Friend button */}
            {!isOwn && currentUser && (
              <div>
                {friendStatus === 'accepted' ? (
                  <div style={{ background: 'rgba(255,255,255,0.1)', color: '#c9a84c', padding: '8px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                    ✓ Друзья
                  </div>
                ) : friendStatus === 'pending' ? (
                  <div style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)', padding: '8px 20px', borderRadius: 6, fontSize: 13 }}>
                    Запрос отправлен
                  </div>
                ) : (
                  <button onClick={sendFriendRequest} style={{
                    background: '#c9a84c', color: '#0e1c3a', border: 'none',
                    padding: '8px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600
                  }}>
                    + Добавить в друзья
                  </button>
                )}
              </div>
            )}
            {!isOwn && !currentUser && (
              <Link href="/login" style={{ background: '#c9a84c', color: '#0e1c3a', padding: '8px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                Войти
              </Link>
            )}
          </div>
        </div>

        {/* Books */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 2.5rem 80px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
            {([['all', lang === 'kz' ? 'Барлығы' : 'Все'], ['want', lang === 'kz' ? 'Оқығым келеді' : 'Хочу'], ['reading', lang === 'kz' ? 'Оқып жатырмын' : 'Читаю'], ['done', lang === 'kz' ? 'Оқып болдым' : 'Прочитал(а)']] as const).map(([k, label]) => (
              <button key={k} onClick={() => setActiveTab(k)} style={{
                background: activeTab === k ? '#1a2d5a' : '#fff',
                color: activeTab === k ? '#fff' : '#1a2d5a',
                border: `1.5px solid ${activeTab === k ? '#1a2d5a' : 'rgba(26,45,90,0.12)'}`,
                fontSize: 12, fontWeight: activeTab === k ? 600 : 400, padding: '7px 16px', borderRadius: 5,
                transition: 'all .15s',
              }}>
                {label} <span style={{ fontSize: 11, opacity: .7 }}>({k === 'all' ? userBooks.length : userBooks.filter(b => b.status === k).length})</span>
              </button>
            ))}
          </div>

          {filteredBooks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(14,28,58,0.3)' }}>
              📚<br /><br />
              {isOwn ? 'Добавь первую книгу в каталоге' : 'Здесь пока пусто'}
              {isOwn && (
                <div style={{ marginTop: 16 }}>
                  <Link href="/catalog" style={{ background: '#c9a84c', color: '#0e1c3a', padding: '10px 24px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                    Перейти в каталог
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredBooks.map(ub => {
                const book = getBook(ub.book_id)
                if (!book) return null
                const st = STATUS_LABELS[ub.status]
                return (
                  <div key={ub.id} onClick={() => setSelectedBook(book)}
                    style={{
                      background: '#fff', borderRadius: 10, padding: '16px 20px',
                      border: '1px solid rgba(26,45,90,0.09)', cursor: 'pointer',
                      display: 'flex', gap: 16, alignItems: 'flex-start',
                      transition: 'box-shadow .15s'
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(26,45,90,0.1)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = ''}
                  >
                    {/* Color block */}
                    <div style={{ width: 44, height: 60, background: book.color, borderRadius: 4, flexShrink: 0 }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0e1c3a', marginBottom: 3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {book.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(14,28,58,0.45)', marginBottom: 8 }}>{book.author}</div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: st.color, fontWeight: 600 }}>{st.label}</span>
                        {ub.rating && (
                          <span style={{ fontSize: 12, color: '#c9a84c' }}>
                            {'★'.repeat(ub.rating)}{'☆'.repeat(5 - ub.rating)}
                          </span>
                        )}
                      </div>
                      {ub.review && (
                        <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(14,28,58,0.55)', lineHeight: 1.6, fontStyle: 'italic', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                          «{ub.review}»
                        </div>
                      )}
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
