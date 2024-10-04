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
      startDate: string
      downPayment: string
    }
}

export default function PaymentSummary({ paymentType, paymentDetails }: PaymentSummaryProps) {
    const calculateInstallmentAmount = () => {
        const totalAmount = parseFloat(paymentDetails.totalAmount)
        const downPayment = parseFloat(paymentDetails.downPayment) || 0
        const numberOfInstallments = parseInt(paymentDetails.installments)
        if (isNaN(totalAmount) || isNaN(numberOfInstallments) || numberOfInstallments === 0) return '0'
        return ((totalAmount - downPayment) / numberOfInstallments).toFixed(2)
    }

    const getPaymentSchedule = (): PaymentScheduleItem[] => {
        return generatePaymentSchedule(
            parseFloat(paymentDetails.totalAmount),
            parseInt(paymentDetails.installments),
            paymentDetails.frequency,
            new Date(paymentDetails.startDate),
            parseFloat(paymentDetails.downPayment) || 0
        )
    }

    return (
        <div>
            <h3 className="font-semibold mb-2">Payment Summary</h3>
            <p>Customer Name: {paymentDetails.customerName}</p>
            <p>Email: {paymentDetails.email}</p>
            <p>Total Amount: ${paymentDetails.totalAmount}</p>
            <p>Payment Type: {paymentType}</p>
            <p>Start Date: {paymentDetails.startDate}</p>
            {paymentType !== 'one-off' && (
                <>
                    <p>Frequency: {paymentDetails.frequency}</p>
                    <p>Auto-charge: {paymentDetails.autoCharge ? 'Enabled' : 'Disabled'}</p>
                </>
            )}
            {paymentType === 'installment' && (
                <>
                    <p>Number of Installments: {paymentDetails.installments}</p>
                    <p>Down Payment: ${paymentDetails.downPayment}</p>
                </>
            )}
            <h4 className="font-semibold mt-2">Payment Schedule:</h4>
            {getPaymentSchedule().map((payment, index) => (
                <p key={index}>
                    {format(new Date(payment.date), 'MMM d, yyyy')}: ${payment.amount}
                    {index === 0 && paymentType === 'installment' && parseFloat(paymentDetails.downPayment) > 0 && ' (Down Payment)'}
                    {index === getPaymentSchedule().length - 1 && parseFloat(payment.amount) !== parseFloat(calculateInstallmentAmount()) && ' (Final adjusted payment)'}
                </p>
            ))}
        </div>
    )
}