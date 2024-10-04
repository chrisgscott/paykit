import { format } from 'date-fns'
import { generatePaymentSchedule, PaymentScheduleItem } from '@/utils/paymentSchedule'

interface PaymentSummaryProps {
    paymentType: string
    paymentDetails: {
      customerName: string
      email: string
      totalAmount: string
      installments: string
      frequency: string
      autoCharge: boolean
    }
}

export default function PaymentSummary({ paymentType, paymentDetails }: PaymentSummaryProps) {
    const calculateInstallmentAmount = () => {
        const amount = parseFloat(paymentDetails.totalAmount)
        const numberOfInstallments = parseInt(paymentDetails.installments)
        if (isNaN(amount) || isNaN(numberOfInstallments) || numberOfInstallments === 0) return '0'
        return (amount / numberOfInstallments).toFixed(2)
    }

    const getPaymentSchedule = (): PaymentScheduleItem[] => {
        return generatePaymentSchedule(
            parseFloat(paymentDetails.totalAmount),
            parseInt(paymentDetails.installments),
            paymentDetails.frequency
        )
    }

    return (
        <div>
            <h3 className="font-semibold mb-2">Payment Summary</h3>
            <p>Customer Name: {paymentDetails.customerName}</p>
            <p>Email: {paymentDetails.email}</p>
            <p>Total Amount: ${paymentDetails.totalAmount}</p>
            <p>Payment Type: {paymentType}</p>
            {paymentType !== 'one-off' && (
                <>
                    <p>Frequency: {paymentDetails.frequency}</p>
                    <p>Auto-charge: {paymentDetails.autoCharge ? 'Enabled' : 'Disabled'}</p>
                </>
            )}
            {paymentType === 'installment' && (
                <p>Number of Installments: {paymentDetails.installments}</p>
            )}
            <h4 className="font-semibold mt-2">Payment Schedule:</h4>
            {getPaymentSchedule().map((payment, index) => (
                <p key={index}>
                    {format(new Date(payment.date), 'MMM d, yyyy')}: ${payment.amount}
                    {index === getPaymentSchedule().length - 1 && parseFloat(payment.amount) !== parseFloat(calculateInstallmentAmount()) && ' (Final adjusted payment)'}
                </p>
            ))}
        </div>
    )
}