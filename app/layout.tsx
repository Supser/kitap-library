import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'КІТАП — Оқитын ұлт',
  description: 'Читающая нация — каталог книг для школьников Казахстана',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&family=Unbounded:wght@700;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
