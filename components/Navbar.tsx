'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar({ lang, setLang }: { lang: string; setLang?: (l: string) => void }) {
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const isHome = pathname === '/'

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const glass = scrolled || !isHome
  const isDark = isHome && !scrolled

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
      height: 62,
      background: glass ? 'rgba(242,237,228,0.94)' : 'transparent',
      backdropFilter: glass ? 'blur(20px) saturate(1.6)' : 'none',
      borderBottom: glass ? '1px solid rgba(28,20,16,0.08)' : 'none',
      transition: 'background .35s, border .35s, backdrop-filter .35s',
      display: 'flex', alignItems: 'center',
      padding: '0 clamp(1.25rem, 4vw, 3rem)',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 'auto', userSelect: 'none' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: 'linear-gradient(135deg, #C8963E, #9B6E22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(200,150,62,.35)',
          flexShrink: 0,
        }}>
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path d="M9 2C7 1 4 1 1 2v10c3-1 5-1 8 0" stroke="#1C1410" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M9 2c2-1 5-1 8 0v10c-3-1-5-1-8 0" stroke="#1C1410" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 13, fontWeight: 700, letterSpacing: '.06em', lineHeight: 1, color: isDark ? '#fff' : 'var(--ink)' }}>КІТАП</div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 7, letterSpacing: '.2em', color: 'var(--gold)', marginTop: 2, textTransform: 'uppercase' }}>ОҚИТЫН ҰЛТ</div>
        </div>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <NavLink href="/catalog" active={pathname === '/catalog'} isDark={isDark}>
          {lang === 'kz' ? 'Каталог' : 'Каталог'}
        </NavLink>

        {user && (
          <>
            <NavLink href={`/profile/${user.id}`} active={pathname.startsWith('/profile')} isDark={isDark}>
              {lang === 'kz' ? 'Кітапханам' : 'Библиотека'}
            </NavLink>
            <NavLink href="/friends" active={pathname === '/friends'} isDark={isDark}>
              {lang === 'kz' ? 'Достар' : 'Друзья'}
            </NavLink>
          </>
        )}

        <Divider isDark={isDark} />

        {/* Lang toggle */}
        {setLang && (
          <div style={{ display: 'flex', gap: 3 }}>
            {[['ҚАЗ', 'kz'], ['РУС', 'ru']].map(([lbl, val]) => {
              const active = lang === val
              return (
                <button key={val} onClick={() => setLang(val)} style={{
                  padding: '4px 9px', borderRadius: 3, fontSize: 10, fontWeight: 600,
                  fontFamily: 'var(--display)',
                  background: active ? 'var(--gold)' : 'transparent',
                  color: active ? 'var(--ink)' : (isDark ? 'rgba(255,255,255,.45)' : 'var(--ink-light)'),
                  border: `1px solid ${active ? 'var(--gold)' : (isDark ? 'rgba(255,255,255,.18)' : 'var(--border)')}`,
                  transition: 'all .15s',
                }}>{lbl}</button>
              )
            })}
          </div>
        )}

        <Divider isDark={isDark} />

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href={`/profile/${user.id}`} style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--navy-mid), var(--navy))',
              border: '2px solid var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--serif)', fontSize: 13, fontWeight: 600, color: 'var(--gold-light)',
            }}>
              {(user.email?.[0] ?? 'А').toUpperCase()}
            </Link>
            <button onClick={handleLogout} style={{
              fontSize: 11, color: isDark ? 'rgba(255,255,255,.4)' : 'var(--ink-faint)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,.12)' : 'var(--border)'}`,
              padding: '5px 12px', borderRadius: 4,
              transition: 'all .15s',
            }}>{lang === 'kz' ? 'Шығу' : 'Выйти'}</button>
          </div>
        ) : (
          <Link href="/login" style={{
            background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
            color: 'var(--ink)', fontFamily: 'var(--display)',
            fontSize: 11, fontWeight: 700, letterSpacing: '.04em',
            padding: '8px 18px', borderRadius: 5,
            boxShadow: '0 2px 14px rgba(200,150,62,.3)',
            display: 'inline-block',
          }}>{lang === 'kz' ? 'Кіру' : 'Войти'}</Link>
        )}
      </div>
    </nav>
  )
}

function NavLink({ href, children, active, isDark }: {
  href: string; children: React.ReactNode; active: boolean; isDark: boolean
}) {
  return (
    <Link href={href} style={{
      padding: '6px 14px', borderRadius: 4, fontSize: 13,
      background: active ? 'rgba(28,20,16,0.07)' : 'transparent',
      color: active ? 'var(--gold-dark)' : (isDark ? 'rgba(255,255,255,.55)' : 'var(--ink-light)'),
      fontWeight: active ? 500 : 400,
      transition: 'all .15s',
      display: 'inline-block',
    }}>{children}</Link>
  )
}

function Divider({ isDark }: { isDark: boolean }) {
  return <div style={{ width: 1, height: 18, background: isDark ? 'rgba(255,255,255,.12)' : 'var(--border)', margin: '0 4px', flexShrink: 0 }} />
}
