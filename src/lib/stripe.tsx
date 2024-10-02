import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// Load Stripe outside of the component to avoid recreating the Stripe object on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeWrapperProps {
  children: React.ReactNode
}

export function StripeWrapper({ children }: StripeWrapperProps) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  )
}