import { useState } from 'react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import OneOffPayment from './OneOffPayment'
import PaymentPlan from './PaymentPlan'
import RecurringPayment from './RecurringPayment'
import PaymentSummary from './PaymentSummary'
import { StripeWrapper } from '@/lib/stripe'

export default function CreatePayment() {
  const [paymentType, setPaymentType] = useState('one-off')
  const [paymentDetails, setPaymentDetails] = useState({
    customerName: '',
    totalAmount: '',
    installments: '1',
    frequency: 'monthly',
    autoCharge: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle payment creation logic here
    console.log('Creating payment:', paymentDetails)
  }

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
              <TabsTrigger value="plan">Payment Plan</TabsTrigger>
              <TabsTrigger value="recurring">Ongoing Recurring</TabsTrigger>
            </TabsList>
            <TabsContent value="one-off">
              <OneOffPayment paymentDetails={paymentDetails} setPaymentDetails={setPaymentDetails} />
            </TabsContent>
            <TabsContent value="plan">
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