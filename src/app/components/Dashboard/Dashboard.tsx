import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Users, BarChart2 } from 'lucide-react'
import StatCard from './StatCard'
import PaymentChart from './PaymentChart'
import QuickActions from './QuickActions'
import RecentActivity from './RecentActivity'
import ActivePayments from './ActivePayments'
import PendingPayments from './PendingPayments'

export default function Dashboard() {
  const [trendTimeRange, setTrendTimeRange] = useState('30')
  const [activeSection, setActiveSection] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Collected This Month"
          value="$10,500"
          description="Total payments collected this month"
          icon={CreditCard}
        />
        <StatCard
          title="Pending Payment Requests"
          value="15 Pending"
          description="Payment requests awaiting action"
          icon={Users}
        />
        <StatCard
          title="Upcoming Payments"
          value="$3,200"
          description="Payments scheduled in the next 30 days"
          icon={BarChart2}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PaymentChart trendTimeRange={trendTimeRange} setTrendTimeRange={setTrendTimeRange} />
        <QuickActions setActiveSection={setActiveSection} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RecentActivity />
        <ActivePayments />
        <PendingPayments />
      </div>
    </div>
  )
}