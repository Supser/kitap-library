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

      // Accepted friends
      const { data: fs } = await supabase.from('friendships').select(`
        *,
        requester:profiles!friendships_requester_id_fkey(id, full_name),
        receiver:profiles!friendships_receiver_id_fkey(id, full_name)
      `).or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`).eq('status', 'accepted')

      // Pending incoming
      const { data: ps } = await supabase.from('friendships').select(`
        *,
        requester:profiles!friendships_requester_id_fkey(id, full_name)
      `).eq('receiver_id', user.id).eq('status', 'pending')

      setFriends(fs || [])
      setPending(ps || [])
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
      <div style={{ paddingTop: 64, minHeight: '100vh', background: '#f5f3ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, color: 'rgba(14,28,58,0.5)', marginBottom: 16 }}>Войди, чтобы видеть друзей</div>
          <Link href="/login" style={{ background: '#c9a84c', color: '#0e1c3a', padding: '10px 24px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
            Войти
          </Link>
        </div>
      </div>
    </>
  )

  return (
    <>
      <Navbar lang={lang} />
      <div style={{ paddingTop: 64, minHeight: '100vh', background: '#f5f3ee' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 2.5rem 80px' }}>

          <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 24, fontWeight: 700, color: '#0e1c3a', marginBottom: 32 }}>
            Друзья
          </div>

          {/* Search users */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid rgba(26,45,90,0.09)', marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0e1c3a', marginBottom: 12 }}>Найти пользователя</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchUsers()}
                placeholder="Введи имя..."
                style={{ flex: 1, padding: '10px 14px', borderRadius: 6, border: '1px solid rgba(26,45,90,0.15)', fontSize: 13, outline: 'none', color: '#0e1c3a' }}
              />
              <button onClick={searchUsers} style={{ background: '#c9a84c', color: '#0e1c3a', border: 'none', padding: '10px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                {searching ? '...' : 'Найти'}
              </button>
            </div>
            {searchResults.length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {searchResults.map(u => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f5f3ee', borderRadius: 8 }}>
                    <Link href={`/profile/${u.id}`} style={{ fontSize: 14, fontWeight: 500, color: '#0e1c3a' }}>
                      {u.full_name || 'Пользователь'}
                    </Link>
                    {u.requested ? (
                      <span style={{ fontSize: 12, color: 'rgba(14,28,58,0.4)' }}>Отправлено</span>
                    ) : (
                      <button onClick={() => sendRequest(u.id)} style={{ background: '#1a2d5a', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 4, fontSize: 12 }}>
                        + Добавить
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending requests */}
          {pending.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0e1c3a', marginBottom: 12 }}>
                Входящие запросы ({pending.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pending.map(f => (
                  <div key={f.id} style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href={`/profile/${f.requester.id}`} style={{ fontSize: 14, fontWeight: 500, color: '#0e1c3a' }}>
                      {f.requester.full_name || 'Пользователь'}
                    </Link>
                    <button onClick={() => acceptRequest(f.id)} style={{ background: '#c9a84c', color: '#0e1c3a', border: 'none', padding: '7px 16px', borderRadius: 5, fontSize: 12, fontWeight: 600 }}>
                      Принять
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Friends list */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0e1c3a', marginBottom: 12 }}>
              Мои друзья ({friends.length})
            </div>
            {friends.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(14,28,58,0.3)', fontSize: 14 }}>
                Пока нет друзей. Найди их через поиск выше.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {friends.map(f => {
                  const friend = getFriendProfile(f)
                  if (!friend) return null
                  return (
                    <Link key={f.id} href={`/profile/${friend.id}`}
                      style={{ background: '#fff', borderRadius: 10, padding: '16px 20px', border: '1px solid rgba(26,45,90,0.09)', display: 'flex', alignItems: 'center', gap: 14, transition: 'box-shadow .15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(26,45,90,0.1)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = ''}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1a2d5a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Unbounded', sans-serif", fontSize: 16, fontWeight: 700, color: '#c9a84c', flexShrink: 0 }}>
                        {friend.full_name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0e1c3a' }}>{friend.full_name || 'Пользователь'}</div>
                        <div style={{ fontSize: 12, color: 'rgba(14,28,58,0.4)', marginTop: 2 }}>Посмотреть полку →</div>
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
