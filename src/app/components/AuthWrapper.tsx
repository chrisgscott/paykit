'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { AuthProvider } from '@/contexts/AuthContext'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session && pathname !== '/login' && pathname !== '/signup' && !pathname.startsWith('/auth/callback')) {
        router.push('/login')
      } else {
        setIsLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        if (pathname === '/login' || pathname === '/signup') {
          router.push('/')
        }
      } else if (event === 'SIGNED_OUT') {
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router, pathname])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <AuthProvider>{children}</AuthProvider>
}