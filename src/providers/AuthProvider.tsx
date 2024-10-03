import { AuthProvider as SupabaseAuthProvider } from '@/contexts/AuthContext'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
}