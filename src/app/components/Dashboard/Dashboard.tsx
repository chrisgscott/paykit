'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

// Define types for our dashboard data
type DashboardStats = {
  totalCollected: number
  pendingPayments: number
  upcomingPayments: number
}

type ChartData = {
  date: string
  collected: number
  scheduled: number
}

interface DashboardProps {
  user: User
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const queryClient = useQueryClient()
  const supabase = createClient()

  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      console.error('No active user')
      return
    }

    // Fetch total collected this month
    const { data: totalCollected, error: totalError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('status', 'successful')
      .gte('transaction_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      .lt('transaction_date', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString())

    // Fetch pending payment requests
    const { count: pendingPayments, error: pendingError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Fetch upcoming payments for next 30 days
    const { data: upcomingPayments, error: upcomingError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('status', 'pending')
      .gte('scheduled_date', new Date().toISOString())
      .lt('scheduled_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())

    if (totalError || pendingError || upcomingError) {
      console.error('Error fetching dashboard data:', totalError || pendingError || upcomingError)
    } else {
      setStats({
        totalCollected: totalCollected ? totalCollected.reduce((sum, t) => sum + t.amount, 0) : 0,
        pendingPayments: pendingPayments || 0,
        upcomingPayments: upcomingPayments ? upcomingPayments.reduce((sum, t) => sum + t.amount, 0) : 0
      })
    }

    // Fetch chart data
    const { data: chartData, error: chartError } = await supabase
      .from('transactions')
      .select('transaction_date, amount, status')
      .eq('user_id', user.id)
      .gte('transaction_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('transaction_date', { ascending: true })

    if (chartError) {
      console.error('Error fetching chart data:', chartError)
    } else {
      setChartData(processChartData(chartData))
    }
  }, [supabase])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  useEffect(() => {
    const paymentPlansSubscription = supabase
      .channel('payment_plans_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'payment_plans',
        }, 
        (payload) => {
          console.log('Payment plans change received!', payload)
          queryClient.invalidateQueries({ queryKey: ['dashboardData'] })
        }
      )
      .subscribe()

    const transactionsSubscription = supabase
      .channel('transactions_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions',
        }, 
        (payload) => {
          console.log('Transactions change received!', payload)
          queryClient.invalidateQueries({ queryKey: ['dashboardData'] })
        }
      )
      .subscribe()

    return () => {
      paymentPlansSubscription.unsubscribe()
      transactionsSubscription.unsubscribe()
    }
  }, [queryClient, supabase])

  const processChartData = (data: any[]): ChartData[] => {
    // Process the raw data into the format expected by the chart component
    // This is a simplified example and may need to be adjusted based on your specific requirements
    const dataMap = new Map<string, ChartData>()

    data.forEach(transaction => {
      const date = new Date(transaction.transaction_date).toISOString().split('T')[0]
      if (!dataMap.has(date)) {
        dataMap.set(date, { date, collected: 0, scheduled: 0 })
      }
      const entry = dataMap.get(date)!
      if (transaction.status === 'successful') {
        entry.collected += transaction.amount
      } else if (transaction.status === 'pending') {
        entry.scheduled += transaction.amount
      }
    })

    return Array.from(dataMap.values())
  }

  if (!stats) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCollected.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments} Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Payments (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.upcomingPayments.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payments Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="collected" stroke="var(--chart-1)" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="scheduled" stroke="var(--chart-2)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      {/* Add more dashboard components here */}
    </div>
  )
}

export default Dashboard