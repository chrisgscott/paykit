import type { Metadata } from 'next'
import './globals.css'
import { Outfit } from 'next/font/google'
import RootClientLayout from './RootClientLayout'

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
})

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
    <html lang="en" className={outfit.variable}>
      <body className="font-outfit">
        <RootClientLayout>{children}</RootClientLayout>
      </body>
    </html>
  )
}