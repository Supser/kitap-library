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
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isDark = isHome && !scrolled
  const navBg = isDark
    ? (scrolled ? 'rgba(6,8,15,0.98)' : 'transparent')
    : 'rgba(245,243,238,0.97)'
  const navBorder = isDark ? 'transparent' : '1px solid rgba(26,45,90,0.10)'
  const textColor = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(26,45,90,0.8)'

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 400,
      height: 64,
      background: navBg,
      backdropFilter: scrolled || !isHome ? 'blur(16px)' : 'none',
      borderBottom: scrolled || !isHome ? navBorder : 'none',
      transition: 'background .3s, border-color .3s',
      display: 'flex', alignItems: 'center',
      padding: '0 clamp(1rem, 4vw, 2.5rem)',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 'auto', textDecoration: 'none' }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="7" fill="#c9a84c"/>
          <rect x="7" y="7" width="8" height="18" rx="1.5" fill="#0e1c3a"/>
          <rect x="17" y="7" width="8" height="18" rx="1.5" fill="#0e1c3a" opacity="0.6"/>
          <rect x="15" y="7" width="2" height="18" fill="#c9a84c"/>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <div style={{
            fontFamily: "'Unbounded', sans-serif", fontSize: 15, fontWeight: 700,
            letterSpacing: '.08em', lineHeight: 1,
            color: isDark ? '#fff' : '#0e1c3a',
          }}>КІТАП</div>
          <div style={{
            fontFamily: "'Unbounded', sans-serif", fontSize: 6, letterSpacing: '.18em', lineHeight: 1,
            color: '#c9a84c', textTransform: 'uppercase',
          }}>ОҚИТЫН ҰЛТ</div>
        </div>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <NavLink href="/catalog" active={pathname === '/catalog'} isDark={isDark} textColor={textColor}>
          Каталог
        </NavLink>

        {user && (
          <>
            <NavLink href={`/profile/${user.id}`} active={pathname.startsWith('/profile')} isDark={isDark} textColor={textColor}>
              {lang === 'kz' ? 'Профилім' : 'Мой профиль'}
            </NavLink>
            <NavLink href="/friends" active={pathname === '/friends'} isDark={isDark} textColor={textColor}>
              {lang === 'kz' ? 'Достар' : 'Друзья'}
            </NavLink>
          </>
        )}

        <div style={{ width: 1, height: 20, background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(26,45,90,0.10)', margin: '0 6px' }} />

        {/* Lang toggle */}
        {setLang && (
          <div style={{ display: 'flex', gap: 3 }}>
            {(['ҚАЗ', 'РУС'] as const).map(l => {
              const v = l === 'ҚАЗ' ? 'kz' : 'ru'
              const active = lang === v
              return (
                <button key={l} onClick={() => setLang(v)} style={{
                  background: active ? '#c9a84c' : 'transparent',
                  border: `1px solid ${active ? '#c9a84c' : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(26,45,90,0.15)')}`,
                  color: active ? '#0e1c3a' : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(26,45,90,0.5)'),
                  fontSize: 10, fontWeight: 600, fontFamily: "'Unbounded', sans-serif",
                  padding: '4px 9px', borderRadius: 3, cursor: 'pointer',
                  transition: 'all .15s',
                }}>{l}</button>
              )
            })}
          </div>
        )}

        <div style={{ width: 1, height: 20, background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(26,45,90,0.10)', margin: '0 6px' }} />

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href={`/profile/${user.id}`} style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a2d5a, #0e1c3a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Unbounded', sans-serif", fontSize: 12, fontWeight: 700, color: '#c9a84c',
              border: '2px solid #c9a84c',
            }}>
              {(user.email?.[0] ?? 'А').toUpperCase()}
            </Link>
            <button onClick={handleLogout} style={{
              background: 'none',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(26,45,90,0.15)'}`,
              color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(26,45,90,0.4)',
              fontSize: 11, padding: '5px 12px', borderRadius: 4,
              transition: 'all .15s',
            }}>{lang === 'kz' ? 'Шығу' : 'Выйти'}</button>
          </div>
        ) : (
          <Link href="/login" style={{
            background: '#c9a84c',
            color: '#0e1c3a',
            fontSize: 12, fontWeight: 600, fontFamily: "'Unbounded', sans-serif",
            padding: '8px 20px', borderRadius: 5,
            boxShadow: '0 2px 12px rgba(201,168,76,0.3)',
            display: 'inline-block',
          }}>{lang === 'kz' ? 'Кіру' : 'Войти'}</Link>
        )}
      </div>
    </nav>
  )
}

function NavLink({ href, children, active, isDark, textColor }: {
  href: string; children: React.ReactNode; active: boolean; isDark: boolean; textColor: string
}) {
  return (
    <Link href={href} style={{
      background: active ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,45,90,0.06)') : 'transparent',
      color: active ? '#c9a84c' : textColor,
      fontSize: 13, fontWeight: active ? 500 : 400,
      padding: '6px 14px', borderRadius: 4,
      transition: 'color .15s',
      display: 'inline-block',
    }}>{children}</Link>
  )
}
