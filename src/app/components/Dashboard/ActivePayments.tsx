import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface PaymentPlan {
  id: number
  customerName: string
  type: string
  totalAmount: number
  status: string
}

const initialPaymentPlans: PaymentPlan[] = [
  { id: 1, customerName: 'Alice Johnson', type: 'Payment Plan', totalAmount: 1000, status: 'active' },
  { id: 2, customerName: 'Bob Smith', type: 'One-off Payment', totalAmount: 500, status: 'active' },
  { id: 3, customerName: 'Charlie Brown', type: 'Ongoing Recurring', totalAmount: 100, status: 'active' },
]

export default function ActivePayments() {
  const [activePaymentFilter, setActivePaymentFilter] = useState('all')
  const [paymentPlans, setPaymentPlans] = useState(initialPaymentPlans)

  const filteredPlans = paymentPlans.filter(plan => 
    activePaymentFilter === 'all' || plan.type.toLowerCase().includes(activePaymentFilter)
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Active Payments</CardTitle>
        <Select value={activePaymentFilter} onValueChange={setActivePaymentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter payments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="one-off">One-off</SelectItem>
            <SelectItem value="plan">Payment Plans</SelectItem>
            <SelectItem value="recurring">Ongoing Payments</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={plan.customerName} />
                <AvatarFallback>{plan.customerName[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{plan.customerName}</p>
                <p className="text-sm text-muted-foreground">{plan.type}</p>
              </div>
              <div className="ml-auto font-medium">${plan.totalAmount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}