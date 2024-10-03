import type { Metadata } from 'next'
import './globals.css'
import AuthWrapper from '@/components/AuthWrapper'

export const metadata: Metadata = {
  title: 'PayKit',
  description: 'Ridiculously Simple Payment Plans',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  )
}