'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { supabase } from '@/utils/supabase'
import { Database } from '@/types/database'

type PendingPayment = Database['public']['Tables']['payment_plans']['Row'] & {
  customers: { name: string | null }
}

async function fetchPendingPayments(): Promise<PendingPayment[]> {
  const { data, error } = await supabase
    .from('payment_plans')
    .select('*, customers(name)')
    .eq('status', 'pending')
  
  if (error) throw error
  return data
}

export default function PendingPayments() {
  const { data: pendingPayments, isLoading, error } = useQuery({
    queryKey: ['pendingPayments'],
    queryFn: fetchPendingPayments,
  })

  if (isLoading) return <div>Loading pending payments...</div>
  if (error) return <div>Error loading pending payments</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Payments</CardTitle>
        <CardDescription>Customers with pending payment requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingPayments?.map((plan) => (
            <div key={plan.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={plan.customers.name || 'Unknown'} />
                <AvatarFallback>{plan.customers.name ? plan.customers.name[0].toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{plan.customers.name || 'Unknown Customer'}</p>
                <p className="text-sm text-muted-foreground">Resend in 3 days</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                <Send className="h-4 w-4 mr-2" />
                Resend
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}