'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar({ lang, setLang }: { lang: string; setLang?: (l: string) => void }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav style={{
      background: 'rgba(8,12,28,0.97)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2.5rem',
      height: 64,
      borderBottom: '2px solid #c9a84c',
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 300,
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img
          src="/logo.png"
          alt="Кітап"
          style={{ height: 38, width: 'auto', objectFit: 'contain' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div>
          <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>КІТАП</div>
          <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 7, color: '#c9a84c', letterSpacing: '0.1em' }}>ОҚИТЫН ҰЛТ</div>
        </div>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link href="/catalog" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, transition: 'color .15s' }}
          onMouseEnter={e => (e.target as HTMLElement).style.color = '#c9a84c'}
          onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.55)'}>
          Каталог
        </Link>

        {user ? (
          <>
            <Link href={`/profile/${user.id}`}
              style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, transition: 'color .15s' }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#c9a84c'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.55)'}>
              Мой профиль
            </Link>
            <Link href="/friends"
              style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, transition: 'color .15s' }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#c9a84c'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.55)'}>
              Друзья
            </Link>
            <button onClick={handleLogout} style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.55)', fontSize: 12, padding: '6px 14px',
              borderRadius: 4, transition: 'all .15s'
            }}>
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{
              background: '#c9a84c', color: '#0e1c3a', fontSize: 13, fontWeight: 600,
              padding: '7px 18px', borderRadius: 4
            }}>
              Войти
            </Link>
          </>
        )}

        {/* Lang */}
        {setLang && (
          <div style={{ display: 'flex', gap: 4 }}>
            {['ҚАЗ', 'РУС'].map(l => (
              <button key={l} onClick={() => setLang(l === 'ҚАЗ' ? 'kz' : 'ru')} style={{
                background: lang === (l === 'ҚАЗ' ? 'kz' : 'ru') ? '#c9a84c' : 'none',
                border: '1px solid',
                borderColor: lang === (l === 'ҚАЗ' ? 'kz' : 'ru') ? '#c9a84c' : 'rgba(255,255,255,0.2)',
                color: lang === (l === 'ҚАЗ' ? 'kz' : 'ru') ? '#0e1c3a' : 'rgba(255,255,255,0.55)',
                fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 3
              }}>{l}</button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
