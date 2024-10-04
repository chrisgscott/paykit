'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import OneOffPayment from './OneOffPayment'
import PaymentPlan from './PaymentPlan'
import RecurringPayment from './RecurringPayment'
import PaymentSummary from './PaymentSummary'
import { StripeWrapper } from '@/lib/stripe'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'

export interface PaymentDetails {
  customerName: string
  email: string
  totalAmount: string
  installments: string
  frequency: string
  autoCharge: boolean
  startDate: string
  downPayment: string
}

export default function CreatePayment() {
  const [paymentType, setPaymentType] = useState('one-off')
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    customerName: '',
    email: '',
    totalAmount: '',
    installments: '1',
    frequency: 'monthly',
    autoCharge: true,
    startDate: new Date().toISOString().split('T')[0], // Set default to current date
    downPayment: '0'
  })

  const queryClient = useQueryClient()
  const supabase = createClient()

  const createPaymentMutation = useMutation({
    mutationFn: async (details: PaymentDetails) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No active session')
      }

      // Create or update the customer
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .upsert(
          { 
            user_id: session.user.id,
            name: details.customerName, 
            email: details.email 
          },
          { onConflict: 'user_id, email' }
        )
        .select()
      if (customerError) throw customerError

      // Create the payment plan
      const { data, error } = await supabase
        .from('payment_plans')
        .insert([
          {
            user_id: session.user.id,
            customer_id: customerData[0].id,
            name: `${details.customerName}'s ${paymentType} Payment`,
            payment_type: paymentType,
            total_amount: parseFloat(details.totalAmount),
            currency: 'USD',
            installments: paymentType === 'installment' ? parseInt(details.installments) : null,
            frequency: paymentType === 'one-off' ? null : details.frequency,
            start_date: new Date().toISOString(),
            end_date: paymentType === 'recurring' ? null : new Date().toISOString(),
            next_transaction_date: new Date().toISOString(),
            auto_charge: details.autoCharge,
            status: 'active'
          }
        ])
        .select()
      if (error) throw error

      // Create transactions based on payment type
      if (paymentType === 'one-off') {
        await createOneOffTransaction(session.user.id, data[0].id, details)
      } else if (paymentType === 'installment') {
        await createInstallmentTransactions(session.user.id, data[0].id, details)
      } else if (paymentType === 'recurring') {
        await createRecurringTransactions(session.user.id, data[0].id, details)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentPlans'] })
    }
  })

  const createOneOffTransaction = async (userId: string, planId: string, details: PaymentDetails) => {
    const { error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          payment_plan_id: planId,
          amount: parseFloat(details.totalAmount),
          currency: 'USD',
          status: 'completed',
          transaction_date: new Date().toISOString()
        }
      ])
    if (error) throw error
  }

  const createInstallmentTransactions = async (userId: string, planId: string, details: PaymentDetails) => {
    const installments = parseInt(details.installments)
    const amount = parseFloat(details.totalAmount) / installments
    const transactions = []

    for (let i = 0; i < installments; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() + i)
      transactions.push({
        user_id: userId,
        payment_plan_id: planId,
        amount: amount,
        currency: 'USD',
        status: 'pending',
        transaction_date: date.toISOString()
      })
    }

    const { error } = await supabase
      .from('transactions')
      .insert(transactions)
    if (error) throw error
  }

  const createRecurringTransactions = async (userId: string, planId: string, details: PaymentDetails) => {
    const amount = parseFloat(details.totalAmount)
    const transactions = []
    const date = new Date()

    // Create transactions for the next 3 months
    for (let i = 0; i < 3; i++) {
      if (details.frequency === 'weekly') {
        date.setDate(date.getDate() + 7 * (i + 1))
      } else if (details.frequency === 'biweekly') {
        date.setDate(date.getDate() + 14 * (i + 1))
      } else if (details.frequency === 'monthly') {
        date.setMonth(date.getMonth() + 1)
      } else if (details.frequency === 'quarterly') {
        date.setMonth(date.getMonth() + 3)
      }

      transactions.push({
        user_id: userId,
        payment_plan_id: planId,
        amount: amount,
        currency: 'USD',
        status: 'pending',
        transaction_date: date.toISOString()
      })
    }

    const { error } = await supabase
      .from('transactions')
      .insert(transactions)
    if (error) throw error
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createPaymentMutation.mutate(paymentDetails)
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
  }, [queryClient, supabase])

  return (
    <StripeWrapper>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create Payment</CardTitle>
          <CardDescription>Set up a new payment for your customer</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="one-off" onValueChange={(value) => setPaymentType(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="one-off">One-off</TabsTrigger>
              <TabsTrigger value="installment">Payment Plan</TabsTrigger>
              <TabsTrigger value="recurring">Recurring</TabsTrigger>
            </TabsList>
            <TabsContent value="one-off">
              <OneOffPayment paymentDetails={paymentDetails} setPaymentDetails={setPaymentDetails} />
            </TabsContent>
            <TabsContent value="installment">
              <PaymentPlan paymentDetails={paymentDetails} setPaymentDetails={setPaymentDetails} />
            </TabsContent>
            <TabsContent value="recurring">
              <RecurringPayment paymentDetails={paymentDetails} setPaymentDetails={setPaymentDetails} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <PaymentSummary paymentType={paymentType} paymentDetails={paymentDetails} />
        </CardFooter>
      </Card>
    </StripeWrapper>
  )
}