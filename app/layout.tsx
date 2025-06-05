import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '오늘 점심 뭐 먹지?',
  description: '회사 주변 맛집 추천 서비스',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
} 