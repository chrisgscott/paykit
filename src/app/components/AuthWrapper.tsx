'use client'

import React, { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, usePathname } from 'next/navigation'
import { AuthProvider } from '@/contexts/AuthContext'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session && pathname !== '/login') {
        router.push('/login')
      } else {
        setIsLoading(false)
      }
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== '/login') {
        router.push('/login')
      } else {
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router, pathname])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <AuthProvider>{children}</AuthProvider>
}