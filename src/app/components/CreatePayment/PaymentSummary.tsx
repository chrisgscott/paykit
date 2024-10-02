interface PaymentSummaryProps {
    paymentType: string
    paymentDetails: {
      customerName: string
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
  
    return (
      <div className="w-full p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Payment Summary</h3>
        <p>Customer: {paymentDetails.customerName || 'N/A'}</p>
        <p>Payment Type: {paymentType === 'one-off' ? 'One-off Payment' : paymentType === 'plan' ? 'Payment Plan' : 'Ongoing Recurring'}</p>
        <p>{paymentType === 'recurring' ? 'Amount per Payment' : 'Total Amount'}: ${paymentDetails.totalAmount || '0'}</p>
        {paymentType === 'plan' && (
          <>
            <p>Number of Installments: {paymentDetails.installments}</p>
            <p>Amount per Installment: ${calculateInstallmentAmount()}</p>
          </>
        )}
        {paymentType !== 'one-off' && <p>Frequency: {paymentDetails.frequency}</p>}
        <p>Auto-charge: {paymentDetails.autoCharge ? 'Enabled' : 'Disabled'}</p>
      </div>
    )
  }