import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import StripeCardForm from '@/components/StripeCardForm'
import { PaymentPlan } from '@/types/payment'  // Import the shared type

interface EditPaymentFormProps {
  plan: PaymentPlan;
  onUpdate: (updatedPlan: PaymentPlan) => void;
  onCancel: () => void;
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
          <Select value={editedPlan.type} onValueChange={(value) => setEditedPlan({ ...editedPlan, type: value })}>
            <SelectTrigger id="editPaymentType">
              <SelectValue placeholder="Select payment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="One-off Payment">One-off Payment</SelectItem>
              <SelectItem value="Payment Plan">Payment Plan</SelectItem>
              <SelectItem value="Ongoing Recurring">Ongoing Recurring</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="editCustomerName">Customer Name</Label>
          <Input
            id="editCustomerName"
            value={editedPlan.customerName}
            onChange={(e) => setEditedPlan({ ...editedPlan, customerName: e.target.value })}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="editTotalAmount">
            {editedPlan.type === 'Ongoing Recurring' ? 'Amount per Payment' : 'Total Amount'} ($)
          </Label>
          <Input
            id="editTotalAmount"
            value={editedPlan.totalAmount}
            onChange={(e) => setEditedPlan({ ...editedPlan, totalAmount: parseFloat(e.target.value) })}
          />
        </div>
        {editedPlan.type === 'Payment Plan' && (
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
        {editedPlan.type !== 'One-off Payment' && (
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="editFrequency">Payment Frequency</Label>
            <Select value={editedPlan.frequency} onValueChange={(value) => setEditedPlan({ ...editedPlan, frequency: value })}>
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
            checked={editedPlan.autoCharge}
            onCheckedChange={(checked) => setEditedPlan({ ...editedPlan, autoCharge: checked })}
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