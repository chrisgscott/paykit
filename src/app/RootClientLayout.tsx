'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from "@/components/theme-provider"
import AuthWrapper from '@/components/AuthWrapper'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'

const queryClient = new QueryClient()

export default function RootClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthWrapper>
          <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-6 bg-white">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </AuthWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  )
}