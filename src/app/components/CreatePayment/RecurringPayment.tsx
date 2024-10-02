import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import StripeCardForm from '../StripeCardForm'

interface RecurringPaymentProps {
  paymentDetails: {
    customerName: string
    totalAmount: string
    frequency: string
    autoCharge: boolean
  }
  setPaymentDetails: (details: any) => void
}

export default function RecurringPayment({ paymentDetails, setPaymentDetails }: RecurringPaymentProps) {
  return (
    <form>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            id="customerName"
            placeholder="Enter customer name"
            value={paymentDetails.customerName}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, customerName: e.target.value })}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="totalAmount">Amount per Payment ($)</Label>
          <Input
            id="totalAmount"
            placeholder="Enter amount"
            value={paymentDetails.totalAmount}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, totalAmount: e.target.value })}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="frequency">Payment Frequency</Label>
          <Select 
            value={paymentDetails.frequency} 
            onValueChange={(value) => setPaymentDetails({ ...paymentDetails, frequency: value })}
          >
            <SelectTrigger id="frequency">
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
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-charge"
            checked={paymentDetails.autoCharge}
            onCheckedChange={(checked) => setPaymentDetails({ ...paymentDetails, autoCharge: checked })}
          />
          <Label htmlFor="auto-charge">Enable automatic charging</Label>
        </div>
        <StripeCardForm />
      </div>
    </form>
  )
}