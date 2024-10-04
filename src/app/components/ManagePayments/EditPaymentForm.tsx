'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/app/components/ui/textarea'
import StripeCardForm from '@/components/StripeCardForm'
import { PaymentPlan } from '@/types/payment'
import { ExtendedPaymentPlan } from '@/types/payment'

interface EditPaymentFormProps {
  plan: ExtendedPaymentPlan
  onUpdate: (updatedPlan: ExtendedPaymentPlan) => Promise<void>
  onCancel: () => void
}

export default function EditPaymentForm({ plan, onUpdate, onCancel }: EditPaymentFormProps) {
  const [editedPlan, setEditedPlan] = useState(plan)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(editedPlan)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="editPaymentType">Payment Type</Label>
          <Select value={editedPlan.payment_type} onValueChange={(value) => setEditedPlan({ ...editedPlan, payment_type: value as PaymentPlan['payment_type'] })}>
            <SelectTrigger id="editPaymentType">
              <SelectValue placeholder="Select payment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one-off">One-off Payment</SelectItem>
              <SelectItem value="installment">Payment Plan</SelectItem>
              <SelectItem value="recurring">Ongoing Recurring</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="editCustomerName">Customer Name</Label>
          <Input
            id="editCustomerName"
            value={editedPlan.customerName || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedPlan({ ...editedPlan, customerName: e.target.value })}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="editDescription">Description</Label>
          <Textarea
            id="editDescription"
            value={editedPlan.description || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedPlan({ ...editedPlan, description: e.target.value })}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="editTotalAmount">
            {editedPlan.payment_type === 'recurring' ? 'Amount per Payment' : 'Total Amount'} ($)
          </Label>
          <Input
            id="editTotalAmount"
            value={editedPlan.total_amount?.toString() || ''}
            onChange={(e) => setEditedPlan({ ...editedPlan, total_amount: parseFloat(e.target.value) })}
            type="number"
          />
        </div>
        {editedPlan.payment_type === 'installment' && (
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="editInstallments">Number of Installments</Label>
            <Select 
              value={editedPlan.installments?.toString() || '1'} 
              onValueChange={(value) => setEditedPlan({ ...editedPlan, installments: parseInt(value) })}
            >
              <SelectTrigger id="editInstallments">
                <SelectValue placeholder="Select installments" />
              </SelectTrigger>
              <SelectContent position="popper">
                {[1, 3, 6, 12, 24].map((number) => (
                  <SelectItem key={number} value={number.toString()}>
                    {number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {editedPlan.payment_type !== 'one-off' && (
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="editFrequency">Payment Frequency</Label>
            <Select value={editedPlan.frequency || ''} onValueChange={(value) => setEditedPlan({ ...editedPlan, frequency: value })}>
              <SelectTrigger id="editFrequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Switch
            id="editAutoCharge"
            checked={editedPlan.auto_charge || false}
            onCheckedChange={(checked) => setEditedPlan({ ...editedPlan, auto_charge: checked })}
          />
          <Label htmlFor="editAutoCharge">Enable automatic charging</Label>
        </div>
        <StripeCardForm />
        <Button type="submit">Update Payment</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}