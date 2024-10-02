import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

interface PendingPayment {
  id: number
  customerName: string
  status: string
}

const pendingPayments: PendingPayment[] = [
  { id: 2, customerName: 'Bob Smith', status: 'pending' },
  { id: 5, customerName: 'Ethan Hunt', status: 'pending' },
]

export default function PendingPayments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Payments</CardTitle>
        <CardDescription>Customers with pending payment requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingPayments.map((plan) => (
            <div key={plan.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={plan.customerName} />
                <AvatarFallback>{plan.customerName[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{plan.customerName}</p>
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