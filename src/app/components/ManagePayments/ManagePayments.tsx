'use client'

import { useState, useEffect } from 'react'
import { useQuery, UseQueryResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { StripeWrapper } from '@/lib/stripe'
import PaymentTable from './PaymentTable'
import EditPaymentForm from './EditPaymentForm'
import { createClient } from '@/utils/supabase/client'
import { ExtendedPaymentPlan } from '@/types/payment'

// Use a different name for the custom Error type to avoid conflicts
import type { CustomError } from '@/types/error'

async function fetchPaymentPlans() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  console.log('Fetching payment plans. Current session:', session)

  if (!session) {
    console.error('No active session')
    return []
  }

  const { data, error } = await supabase
    .from('payment_plans')
    .select('*')
    .eq('user_id', session.user.id)

  console.log('Supabase response:', { data, error })

  if (error) {
    console.error('Error fetching payment plans:', error)
    throw error
  }

  console.log('Fetched payment plans:', data)
  return data
}

export default function ManagePayments() {
  const [editingPlan, setEditingPlan] = useState<ExtendedPaymentPlan | null>(null)
  
  const queryClient = useQueryClient()
  const supabase = createClient()

  const { data: paymentPlans, isLoading, error }: UseQueryResult<ExtendedPaymentPlan[], CustomError> = useQuery({
    queryKey: ['paymentPlans'],
    queryFn: fetchPaymentPlans,
  })

  // Handle error separately
  if (error) {
    console.error('Query error:', error)
  }

  const updatePaymentPlanMutation = useMutation({
    mutationFn: async (updatedPlan: ExtendedPaymentPlan) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

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
          status: updatedPlan.status,
          customerName: updatedPlan.customerName
        })
        .eq('id', updatedPlan.id)
        .eq('user_id', session.user.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentPlans'] })
    }
  })

  const deletePaymentPlanMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('payment_plans')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentPlans'] })
    }
  })

  const handleEditPlan = (plan: ExtendedPaymentPlan) => {
    setEditingPlan(plan)
  }

  const handleUpdatePlan = async (updatedPlan: ExtendedPaymentPlan) => {
    try {
      await updatePaymentPlanMutation.mutateAsync(updatedPlan)
      setEditingPlan(null)
    } catch (error) {
      console.error('Error updating plan:', error)
    }
  }

  const handleDeletePlan = async (id: string) => {
    try {
      await deletePaymentPlanMutation.mutateAsync(id)
    } catch (error) {
      console.error('Error deleting plan:', error)
    }
  }

  useEffect(() => {
    const subscription = supabase
      .channel('payment_plans_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'payment_plans',
        }, 
        (payload) => {
          console.log('Change received!', payload)
          queryClient.invalidateQueries({ queryKey: ['paymentPlans'] })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])

  if (isLoading) return <div>Loading payment plans...</div>
  if (error) {
    console.error('Error in ManagePayments:', error)
    return <div>Error loading payment plans: {error.message}</div>
  }
  if (!paymentPlans) return <div>No payment plans found</div>

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