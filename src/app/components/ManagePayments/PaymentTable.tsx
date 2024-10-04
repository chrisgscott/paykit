import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ExtendedPaymentPlan } from '@/types/payment'

interface PaymentTableProps {
  paymentPlans: ExtendedPaymentPlan[]
  onEdit: (plan: ExtendedPaymentPlan) => void
  onDelete: (id: string) => void
}

export default function PaymentTable({ paymentPlans, onEdit, onDelete }: PaymentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer Name</TableHead>
          <TableHead>Payment Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Installments</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Auto-charge</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paymentPlans.map((plan) => (
          <TableRow key={plan.id}>
            <TableCell>{plan.customers?.name || 'N/A'}</TableCell>
            <TableCell>{plan.payment_type}</TableCell>
            <TableCell>${plan.total_amount}</TableCell>
            <TableCell>{plan.installments || 'N/A'}</TableCell>
            <TableCell>{plan.frequency || 'N/A'}</TableCell>
            <TableCell>{plan.auto_charge ? 'Yes' : 'No'}</TableCell>
            <TableCell>
              <Button variant="outline" className="mr-2" onClick={() => onEdit(plan)}>Edit</Button>
              <Button variant="destructive" onClick={() => onDelete(plan.id)}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}