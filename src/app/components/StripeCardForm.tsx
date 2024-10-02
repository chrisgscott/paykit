import { CardElement } from '@stripe/react-stripe-js'
import { Label } from '@/components/ui/label'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
}

export default function StripeCardForm() {
  return (
    <div className="space-y-2">
      <Label htmlFor="card-element">Credit or debit card</Label>
      <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
    </div>
  )
}