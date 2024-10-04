import { Database } from './database'

export type PaymentPlan = Database['public']['Tables']['payment_plans']['Row']

export type ExtendedPaymentPlan = PaymentPlan & {
  customers: { name: string | null }
  customerName?: string
  type?: string
  totalAmount?: number
  autoCharge?: boolean
}