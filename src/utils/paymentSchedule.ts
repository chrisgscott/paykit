import { format, addWeeks, addMonths } from 'date-fns'

export interface PaymentScheduleItem {
  date: string
  amount: string
}

export function generatePaymentSchedule(
  totalAmount: number,
  numberOfInstallments: number,
  frequency: string,
  startDate: Date = new Date()
): PaymentScheduleItem[] {
  if (isNaN(totalAmount) || isNaN(numberOfInstallments) || numberOfInstallments === 0) {
    return []
  }

  const schedule: PaymentScheduleItem[] = []
  const regularInstallmentAmount = parseFloat((totalAmount / numberOfInstallments).toFixed(2))
  let remainingAmount = totalAmount
  let currentDate = startDate

  for (let i = 0; i < numberOfInstallments; i++) {
    let installmentAmount = i === numberOfInstallments - 1 ? remainingAmount : regularInstallmentAmount

    schedule.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      amount: installmentAmount.toFixed(2)
    })

    remainingAmount = parseFloat((remainingAmount - installmentAmount).toFixed(2))

    switch (frequency) {
      case 'weekly':
        currentDate = addWeeks(currentDate, 1)
        break
      case 'biweekly':
        currentDate = addWeeks(currentDate, 2)
        break
      case 'monthly':
        currentDate = addMonths(currentDate, 1)
        break
      case 'quarterly':
        currentDate = addMonths(currentDate, 3)
        break
    }
  }

  return schedule
}