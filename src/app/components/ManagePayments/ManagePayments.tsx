import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { StripeWrapper } from '@/lib/stripe'
import PaymentTable from './PaymentTable'
import EditPaymentForm from './EditPaymentForm'
import { supabase } from '@/utils/supabase'
import { Database } from '@/types/database'
import { PaymentPlan as ImportedPaymentPlan } from '@/types/payment'

type ExtendedPaymentPlan = Database['public']['Tables']['payment_plans']['Row'] & {
  customers: { name: string | null }
  customerName?: string
  type?: string
  totalAmount?: number
  autoCharge?: boolean
}

async function fetchPaymentPlans(): Promise<ExtendedPaymentPlan[]> {
  const { data, error } = await supabase
    .from('payment_plans')
    .select('*, customers(name)')
  
  if (error) throw error
  return data
}

export default function ManagePayments() {
  const [editingPlan, setEditingPlan] = useState<ExtendedPaymentPlan | null>(null)
  
  const { data: paymentPlans, isLoading, error } = useQuery({
    queryKey: ['paymentPlans'],
    queryFn: fetchPaymentPlans,
  })

  const handleEditPlan = (plan: ExtendedPaymentPlan) => {
    setEditingPlan(plan)
  }

  const handleUpdatePlan = async (updatedPlan: ImportedPaymentPlan) => {
    const { error } = await supabase
      .from('payment_plans')
      .update({
        name: updatedPlan.name,
        description: updatedPlan.description,
        payment_type: updatedPlan.payment_type,
        total_amount: updatedPlan.total_amount,
        currency: updatedPlan.currency,
        installments: updatedPlan.installments,
        frequency: updatedPlan.frequency,
        start_date: updatedPlan.start_date,
        end_date: updatedPlan.end_date,
        next_transaction_date: updatedPlan.next_transaction_date,
        auto_charge: updatedPlan.auto_charge,
        status: updatedPlan.status
      })
      .eq('id', updatedPlan.id)

    if (error) {
      console.error('Error updating plan:', error)
      return
    }

    setEditingPlan(null)
  }

  const handleDeletePlan = async (id: string) => {
    const { error } = await supabase
      .from('payment_plans')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting plan:', error)
      return
    }
  }

  if (isLoading) return <div>Loading payment plans...</div>
  if (error) return <div>Error loading payment plans</div>

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
              paymentPlans={paymentPlans || []}
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
            />
          )}
        </CardContent>
      </Card>
    </StripeWrapper>
  )
}