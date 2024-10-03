'use client'

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PaymentChartProps {
  trendTimeRange: string
  setTrendTimeRange: (range: string) => void
}

export default function PaymentChart({ trendTimeRange, setTrendTimeRange }: PaymentChartProps) {
  const chartData = [
    { name: 'Jan', collected: 1000, scheduled: 1200 },
    { name: 'Feb', collected: 1500, scheduled: 1700 },
    { name: 'Mar', collected: 1200, scheduled: 1400 },
    { name: 'Apr', collected: 1800, scheduled: 2000 },
    { name: 'May', collected: 2000, scheduled: 2200 },
    { name: 'Jun', collected: 2400, scheduled: 2600 },
  ]

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Payments Over Time</CardTitle>
        <CardDescription>Track total payments collected and scheduled</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end space-x-2 mb-4">
          <Button variant={trendTimeRange === '7' ? 'secondary' : 'ghost'} onClick={() => setTrendTimeRange('7')}>7 Days</Button>
          <Button variant={trendTimeRange === '30' ? 'secondary' : 'ghost'} onClick={() => setTrendTimeRange('30')}>30 Days</Button>
          <Button variant={trendTimeRange === '90' ? 'secondary' : 'ghost'} onClick={() => setTrendTimeRange('90')}>90 Days</Button>
          <Button variant={trendTimeRange === 'year' ? 'secondary' : 'ghost'} onClick={() => setTrendTimeRange('year')}>1 Year</Button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="collected" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="scheduled" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}