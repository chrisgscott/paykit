'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/database'

type PendingPayment = Database['public']['Tables']['payment_plans']['Row'] & {
  customers: { name: string | null }
}

async function fetchPendingPayments(): Promise<PendingPayment[]> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    console.error('No active session')
    return []
  }
  
  const { data, error } = await supabase
    .from('payment_plans')
    .select('*, customers(name)')
    .eq('user_id', session.user.id)
    .eq('status', 'pending')
  
  if (error) {
    console.error('Error fetching pending payments:', error)
    return []
  }
  
  return data || []
}

export default function PendingPayments() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  const { data: pendingPayments, isLoading, error } = useQuery({
    queryKey: ['pendingPayments'],
    queryFn: fetchPendingPayments
  })

  useEffect(() => {
    const subscription = supabase
      .channel('payment_plans_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'payment_plans',
          filter: `status=eq.pending`
        }, 
        (payload) => {
          console.log('Change received!', payload)
          queryClient.invalidateQueries({ queryKey: ['pendingPayments'] })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient, supabase])

  if (isLoading) return <div>Loading pending payments...</div>
  if (error) return <div>Error loading pending payments</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Payments</CardTitle>
        <CardDescription>Payments awaiting processing</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingPayments && pendingPayments.length > 0 ? (
          <div className="space-y-4">
            {pendingPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{payment.customers.name || 'Unknown Customer'}</p>
                  <p className="text-sm text-muted-foreground">${payment.total_amount.toFixed(2)}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Send className="mr-2 h-4 w-4" />
                  Send Reminder
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div>No pending payments</div>
        )}
      </CardContent>
    </Card>
  )
}