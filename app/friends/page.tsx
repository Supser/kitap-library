'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase'

export default function FriendsPage() {
  const [lang] = useState('ru')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [friends, setFriends] = useState<any[]>([])
  const [pending, setPending] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setCurrentUser(user)

      const { data: fs } = await supabase.from('friendships').select(`
        *, requester:profiles!friendships_requester_id_fkey(id, full_name),
        receiver:profiles!friendships_receiver_id_fkey(id, full_name)
      `).or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`).eq('status', 'accepted')

      const { data: ps } = await supabase.from('friendships').select(`
        *, requester:profiles!friendships_requester_id_fkey(id, full_name)
      `).eq('receiver_id', user.id).eq('status', 'pending')

      setFriends(fs || []); setPending(ps || [])
      setLoading(false)
    }
    load()
  }, [])

  const searchUsers = async () => {
    if (!search.trim()) return
    setSearching(true)
    const { data } = await supabase.from('profiles').select('*')
      .ilike('full_name', `%${search}%`).neq('id', currentUser?.id).limit(10)
    setSearchResults(data || [])
    setSearching(false)
  }

  const acceptRequest = async (friendshipId: string) => {
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId)
    setPending(p => p.filter(f => f.id !== friendshipId))
    const accepted = pending.find(f => f.id === friendshipId)
    if (accepted) setFriends(f => [...f, { ...accepted, status: 'accepted' }])
  }

  const sendRequest = async (userId: string) => {
    if (!currentUser) return
    await supabase.from('friendships').insert({ requester_id: currentUser.id, receiver_id: userId })
    setSearchResults(r => r.map(u => u.id === userId ? { ...u, requested: true } : u))
  }

  const getFriendProfile = (f: any) =>
    f.requester_id === currentUser?.id ? f.receiver : f.requester

  if (!currentUser && !loading) return (
    <>
      <Navbar lang={lang} />
      <div style={{ paddingTop: 62, minHeight: '100vh', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}>Войди, чтобы видеть друзей</div>
          <div style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 24 }}>Следи за чтением друг друга</div>
          <Link href="/login" style={{
            background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
            color: 'var(--ink)', fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700,
            padding: '10px 24px', borderRadius: 6, boxShadow: '0 2px 14px rgba(200,150,62,.3)',
          }}>Войти</Link>
        </div>
      </div>
    </>
  )

  return (
    <>
      <Navbar lang={lang} />
      <div style={{ paddingTop: 62, minHeight: '100vh', background: 'var(--paper)' }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(160deg, #12100E, #1C1814)',
          padding: '52px clamp(1.5rem, 5vw, 4rem) 48px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-40%', right: '-5%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,150,62,.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
            <div style={{ fontSize: 10, letterSpacing: '.18em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'var(--sans)', fontWeight: 500 }}>
              {lang === 'kz' ? 'Оқу желісі' : 'Сеть чтения'}
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, fontStyle: 'italic', color: '#F5EFE6' }}>
              {lang === 'kz' ? 'Достар' : 'Друзья'}
            </h1>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px clamp(1.5rem, 5vw, 4rem) 80px' }}>

          {/* Search */}
          <div style={{ background: 'var(--cream)', borderRadius: 16, padding: 24, border: '1px solid var(--border)', marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 14 }}>Найти читателя</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchUsers()}
                placeholder="Введи имя..."
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 8, fontSize: 13, outline: 'none',
                  border: '1.5px solid var(--border)', color: 'var(--ink)', background: 'var(--paper)',
                  transition: 'border-color .15s',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
              <button onClick={searchUsers} style={{
                background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                color: 'var(--ink)', border: 'none', padding: '10px 20px', borderRadius: 8,
                fontSize: 12, fontWeight: 700, fontFamily: 'var(--display)', letterSpacing: '.04em',
                boxShadow: '0 2px 10px rgba(200,150,62,.25)',
              }}>
                {searching ? '...' : 'Найти'}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {searchResults.map(u => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--paper)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <Link href={`/profile/${u.id}`} style={{ fontFamily: 'var(--serif)', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                      {u.full_name || 'Пользователь'}
                    </Link>
                    {u.requested ? (
                      <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>Отправлено</span>
                    ) : (
                      <button onClick={() => sendRequest(u.id)} style={{
                        background: 'var(--navy)', color: '#fff', border: 'none',
                        padding: '6px 14px', borderRadius: 5, fontSize: 11, fontWeight: 600,
                      }}>+ Добавить</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending requests */}
          {pending.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 12 }}>
                Входящие запросы ({pending.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pending.map(f => (
                  <div key={f.id} style={{ background: 'var(--cream)', borderRadius: 12, padding: '16px 20px', border: '1.5px solid rgba(200,150,62,.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeUp .35s ease both' }}>
                    <Link href={`/profile/${f.requester.id}`} style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                      {f.requester.full_name || 'Пользователь'}
                    </Link>
                    <button onClick={() => acceptRequest(f.id)} style={{
                      background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                      color: 'var(--ink)', border: 'none', padding: '7px 18px', borderRadius: 6,
                      fontSize: 11, fontWeight: 700, fontFamily: 'var(--display)', letterSpacing: '.04em',
                      boxShadow: '0 2px 10px rgba(200,150,62,.25)',
                    }}>Принять</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Friends list */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 14 }}>
              Мои друзья ({friends.length})
            </div>
            {friends.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink)', marginBottom: 6 }}>Пока нет друзей</div>
                <div style={{ fontSize: 13, color: 'var(--ink-faint)' }}>Найди их через поиск выше</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {friends.map(f => {
                  const friend = getFriendProfile(f)
                  if (!friend) return null
                  return (
                    <Link key={f.id} href={`/profile/${friend.id}`} style={{
                      background: 'var(--cream)', borderRadius: 14, padding: '18px 22px',
                      border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16,
                      transition: 'box-shadow .15s, border-color .15s',
                      animation: 'fadeUp .35s ease both',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(28,20,16,.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,150,62,.35)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}
                    >
                      <div style={{
                        width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--navy-mid), var(--navy))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 600, color: 'var(--gold)',
                        border: '2px solid rgba(200,150,62,.25)',
                      }}>
                        {friend.full_name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>{friend.full_name || 'Пользователь'}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>Посмотреть полку →</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
