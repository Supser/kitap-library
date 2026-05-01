'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function RegisterPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)
  const supabase = createClient()

  const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      })
      if (error) { setError(error.message) }
      else if (data.session) { window.location.href = '/' }
      else { setDone(true) }
    } catch {
      setError('Ошибка соединения. Проверьте интернет и попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  const bgStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #0E0C0A 0%, #1C1410 50%, #241A0E 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20, position: 'relative', overflow: 'hidden',
  }

  if (done) return (
    <div style={bgStyle}>
      <div style={{ position: 'absolute', left: '-5%', top: '10%', fontFamily: 'var(--serif)', fontSize: '40vw', fontWeight: 700, fontStyle: 'italic', color: 'rgba(200,150,62,.025)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>Б</div>
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 2, animation: 'fadeUp .4s ease both' }}>
        <div style={{ background: 'rgba(242,237,228,.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: '40px 32px', textAlign: 'center', boxShadow: '0 32px 80px rgba(0,0,0,.4)' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 40, marginBottom: 16, color: 'var(--gold)' }}>✉</div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, fontWeight: 700, color: '#F5EFE6', marginBottom: 12 }}>Проверь почту</div>
          <div style={{ fontSize: 13, color: 'rgba(245,239,230,.45)', lineHeight: 1.7, marginBottom: 28 }}>
            Мы отправили письмо на <strong style={{ color: 'var(--gold-light)' }}>{email}</strong>.<br />
            Перейди по ссылке в письме, чтобы активировать аккаунт.
          </div>
          <Link href="/login" style={{
            display: 'block', padding: '13px',
            background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
            color: 'var(--ink)', fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700, letterSpacing: '.05em',
            borderRadius: 9, textAlign: 'center', boxShadow: '0 4px 20px rgba(200,150,62,.3)',
          }}>Войти</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={bgStyle}>
      <div style={{ position: 'absolute', left: '-5%', top: '10%', fontFamily: 'var(--serif)', fontSize: '40vw', fontWeight: 700, fontStyle: 'italic', color: 'rgba(200,150,62,.025)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>Б</div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 2, animation: 'fadeUp .4s ease both' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(200,150,62,.3)' }}>
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path d="M9 2C7 1 4 1 1 2v10c3-1 5-1 8 0" stroke="#1C1410" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M9 2c2-1 5-1 8 0v10c-3-1-5-1-8 0" stroke="#1C1410" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 14, fontWeight: 700, letterSpacing: '.08em', color: '#fff' }}>КІТАП</div>
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13, color: 'rgba(245,239,230,.35)' }}>
            Создай аккаунт
          </div>
        </div>

        <div style={{ background: 'rgba(242,237,228,.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: '32px 32px 28px', boxShadow: '0 32px 80px rgba(0,0,0,.4)' }}>
          <form onSubmit={handleRegister}>
            <DarkField label="Имя" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Арман Сейтов" />
            <DarkField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
            <DarkField label="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Минимум 6 символов" last />

            {error && (
              <div style={{ background: 'rgba(200,50,50,.15)', color: '#f08080', fontSize: 12, padding: '9px 13px', borderRadius: 6, marginBottom: 14 }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
              color: 'var(--ink)', fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700, letterSpacing: '.05em',
              borderRadius: 9, border: 'none',
              boxShadow: '0 4px 20px rgba(200,150,62,.3)',
              opacity: loading ? .7 : 1, transition: 'opacity .15s',
            }}>
              {loading ? '...' : 'Создать аккаунт'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: 'rgba(255,255,255,.25)' }}>
            Уже есть аккаунт?{' '}
            <Link href="/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>Войти</Link>
          </div>
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <Link href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,.18)' }}>← На главную</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function DarkField({ label, type, value, onChange, placeholder, last }: {
  label: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; last?: boolean
}) {
  const [foc, setFoc] = useState(false)
  return (
    <div style={{ marginBottom: last ? 20 : 14 }}>
      <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(245,239,230,.35)', marginBottom: 7 }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={type !== 'text'}
        autoCapitalize="none" autoCorrect="off"
        onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
        style={{
          width: '100%', padding: '11px 14px', borderRadius: 7, fontSize: 14, outline: 'none',
          background: 'rgba(255,255,255,.06)',
          border: `1.5px solid ${foc ? 'var(--gold)' : 'rgba(255,255,255,.1)'}`,
          color: '#fff', transition: 'border-color .15s',
        }} />
    </div>
  )
}
