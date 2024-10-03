'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { supabase } from '@/utils/supabase'
import { Database } from '../../../types/database'

type Transaction = Database['public']['Tables']['transactions']['Row']

async function fetchRecentTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('transaction_date', { ascending: false })
    .limit(5)

  if (error) throw error
  return data
}

export default function RecentActivity() {
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: fetchRecentTransactions,
  })

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