'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/client'
import { Database } from '../../../types/database'

type Transaction = Database['public']['Tables']['transactions']['Row']

async function fetchRecentTransactions(): Promise<Transaction[]> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    console.error('No active session')
    return []
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', session.user.id)
    .order('transaction_date', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching recent transactions:', error)
    return []
  }

  return data || []
}

export default function RecentActivity() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: fetchRecentTransactions
  })

  if (error) console.error('Query error:', error)

  useEffect(() => {
    const subscription = supabase
      .channel('transactions_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions',
        }, 
        (payload) => {
          console.log('Change received!', payload)
          queryClient.invalidateQueries({ queryKey: ['recentTransactions'] })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient, supabase])

  if (isLoading) return <div>Loading recent activity...</div>
  if (error) return <div>Error loading recent activity</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest payment activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions?.map((transaction) => (
            <div key={transaction.id} className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${transaction.status === 'failed' ? 'bg-red-500' : 'bg-green-500'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {transaction.status === 'successful' ? 'Received' : transaction.status === 'failed' ? 'Failed' : 'Pending'} ${transaction.amount} for plan #{transaction.payment_plan_id}
                </p>
                <p className="text-xs text-muted-foreground">{new Date(transaction.transaction_date || transaction.scheduled_date).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}