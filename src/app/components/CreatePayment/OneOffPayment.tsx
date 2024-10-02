import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import StripeCardForm from '../StripeCardForm'

interface OneOffPaymentProps {
  paymentDetails: {
    customerName: string
    totalAmount: string
    autoCharge: boolean
  }
  setPaymentDetails: (details: any) => void
}

export default function OneOffPayment({ paymentDetails, setPaymentDetails }: OneOffPaymentProps) {
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
          <Label htmlFor="totalAmount">Total Amount ($)</Label>
          <Input
            id="totalAmount"
            placeholder="Enter amount"
            value={paymentDetails.totalAmount}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, totalAmount: e.target.value })}
          />
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