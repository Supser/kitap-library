import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Кітап — Оқитын ұлт',
  description: 'Читающая нация — каталог книг для школьников Казахстана',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700&family=Golos+Text:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: "'Golos Text', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
