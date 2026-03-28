'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
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

  if (done) return (
    <div style={{ minHeight: '100vh', background: '#0a0e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
        <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 18, fontWeight: 700, color: '#0e1c3a', marginBottom: 12 }}>Проверь почту</div>
        <div style={{ fontSize: 14, color: 'rgba(14,28,58,0.55)', lineHeight: 1.6, marginBottom: 24 }}>
          Мы отправили письмо на <strong style={{ color: '#0e1c3a' }}>{email}</strong>.<br />
          Перейди по ссылке в письме, чтобы активировать аккаунт.
        </div>
        <Link href="/login" style={{ display: 'block', padding: 13, background: '#c9a84c', color: '#0e1c3a', fontWeight: 700, fontSize: 14, borderRadius: 7, textAlign: 'center' }}>
          Войти
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 20, fontWeight: 700, color: '#0e1c3a', marginBottom: 6 }}>КІТАП</div>
          <div style={{ fontSize: 14, color: 'rgba(14,28,58,0.45)' }}>Создай свой аккаунт</div>
        </div>

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#0e1c3a', marginBottom: 6 }}>Имя</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid rgba(14,28,58,0.15)', fontSize: 14, outline: 'none', color: '#0e1c3a' }}
              placeholder="Иван" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#0e1c3a', marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              autoCapitalize="none" autoCorrect="off"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid rgba(14,28,58,0.15)', fontSize: 14, outline: 'none', color: '#0e1c3a' }}
              placeholder="your@email.com" />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#0e1c3a', marginBottom: 6 }}>Пароль</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid rgba(14,28,58,0.15)', fontSize: 14, outline: 'none', color: '#0e1c3a' }}
              placeholder="Минимум 6 символов" />
          </div>

          {error && <div style={{ background: '#fef2f2', color: '#c0392b', fontSize: 13, padding: '10px 14px', borderRadius: 6, marginBottom: 16 }}>{error}</div>}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 13, background: '#c9a84c', color: '#0e1c3a',
            fontWeight: 700, fontSize: 14, borderRadius: 7, border: 'none'
          }}>
            {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(14,28,58,0.45)' }}>
          Уже есть аккаунт?{' '}
          <Link href="/login" style={{ color: '#c9a84c', fontWeight: 600 }}>Войти</Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <Link href="/" style={{ fontSize: 13, color: 'rgba(14,28,58,0.35)' }}>← На главную</Link>
        </div>
      </div>
    </div>
  )
}
