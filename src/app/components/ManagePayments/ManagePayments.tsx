import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { StripeWrapper } from '@/lib/stripe'
import PaymentTable from './PaymentTable'
import EditPaymentForm from './EditPaymentForm'
import { PaymentPlan } from '@/types/payment'  // Import the shared type

export default function ManagePayments() {
  const [editingPlan, setEditingPlan] = useState<PaymentPlan | null>(null)
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([
    // Add some initial data or leave as an empty array
  ])

  const handleEditPlan = (plan: PaymentPlan) => {
    setEditingPlan(plan)
  }

  const handleUpdatePlan = (updatedPlan: PaymentPlan) => {
    const updatedPlans = paymentPlans.map(plan => 
      plan.id === updatedPlan.id ? updatedPlan : plan
    )
    setPaymentPlans(updatedPlans)
    setEditingPlan(null)
  }

  const handleDeletePlan = (id: number) => {  // Changed to number
    const updatedPlans = paymentPlans.filter(plan => plan.id !== id)
    setPaymentPlans(updatedPlans)
  }

  return (
    <StripeWrapper>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Manage Payments</CardTitle>
          <CardDescription>View, edit, and delete existing payments</CardDescription>
        </CardHeader>
        <CardContent>
          {editingPlan ? (
            <EditPaymentForm
              plan={editingPlan}
              onUpdate={handleUpdatePlan}
              onCancel={() => setEditingPlan(null)}
            />
          ) : (
            <PaymentTable
              paymentPlans={paymentPlans}
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
            />
          )}
        </CardContent>
      </Card>
    </StripeWrapper>
  )
}