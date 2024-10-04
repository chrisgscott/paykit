'use client'

import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/database'
import { ExtendedPaymentPlan } from '@/types/payment'

type PaymentPlan = Database['public']['Tables']['payment_plans']['Row'] & {
  customers: { name: string | null }
}

async function fetchActivePayments(): Promise<PaymentPlan[]> {
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
    .eq('status', 'active')
  
  if (error) {
    console.error('Error fetching active payments:', error)
    return []
  }
  
  return data || []
}

export default function ActivePayments() {
  const [filter, setFilter] = useState<string>('all')
  const queryClient = useQueryClient()
  const supabase = createClient()

  const { data: activePlans, isLoading, error } = useQuery({
    queryKey: ['activePayments'],
    queryFn: fetchActivePayments
  })

  useEffect(() => {
    const subscription = supabase
      .channel('payment_plans_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'payment_plans',
          filter: `status=eq.active`
        }, 
        (payload) => {
          console.log('Change received!', payload)
          queryClient.invalidateQueries({ queryKey: ['activePayments'] })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient, supabase])

  if (isLoading) return <div>Loading active payments...</div>
  if (error) return <div>Error loading active payments</div>

  const filteredPlans = activePlans?.filter(plan => 
    filter === 'all' || plan.payment_type === filter
  ) || []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Payment Plans</CardTitle>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="one-off">One-off</SelectItem>
            <SelectItem value="recurring">Recurring</SelectItem>
            <SelectItem value="installment">Installment</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={plan.customers?.name || 'Unknown'} />
                <AvatarFallback>{plan.customers?.name ? plan.customers.name[0] : 'U'}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{plan.customers?.name || 'Unknown'}</p>
                <p className="text-sm text-muted-foreground">{plan.payment_type}</p>
              </div>
              <div className="ml-auto font-medium">${plan.total_amount?.toFixed(2) || 'N/A'}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}