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

interface PaymentDetails {
  customerName: string
  totalAmount: string
  installments: string
  frequency: string
  autoCharge: boolean
}

export default function CreatePayment() {
  const [paymentType, setPaymentType] = useState('one-off')
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    customerName: '',
    totalAmount: '',
    installments: '1',
    frequency: 'monthly',
    autoCharge: true
  })

  const queryClient = useQueryClient()
  const supabase = createClient()

  const createPaymentMutation = useMutation({
    mutationFn: async (details: PaymentDetails) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No active session')
      }

      const { data, error } = await supabase
        .from('payment_plans')
        .insert([
          {
            user_id: session.user.id,
            customer_name: details.customerName,
            payment_type: paymentType,
            total_amount: parseFloat(details.totalAmount),
            installments: parseInt(details.installments),
            frequency: details.frequency,
            auto_charge: details.autoCharge,
            status: 'pending'
          }
        ])
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentPlans'] })
    }
  })

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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Payment</CardTitle>
          <CardDescription>Set up a new payment for your customer</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={paymentType} onValueChange={setPaymentType}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="one-off">One-off Payment</TabsTrigger>
              <TabsTrigger value="installment">Payment Plan</TabsTrigger>
              <TabsTrigger value="recurring">Ongoing Recurring</TabsTrigger>
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
        <CardFooter className="flex flex-col items-start space-y-4">
          <PaymentSummary paymentType={paymentType} paymentDetails={paymentDetails} />
          <Button className="w-full" onClick={handleSubmit}>Create Payment</Button>
        </CardFooter>
      </Card>
    </StripeWrapper>
  )
}