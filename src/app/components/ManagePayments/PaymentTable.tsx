import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PaymentPlan } from '@/types/payment'  // Import the shared type

interface PaymentTableProps {
  paymentPlans: PaymentPlan[]
  onEdit: (plan: PaymentPlan) => void
  onDelete: (id: number) => void
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
            <TableCell>{plan.customerName}</TableCell>
            <TableCell>{plan.type}</TableCell>
            <TableCell>${plan.totalAmount}</TableCell>
            <TableCell>{plan.installments || 'N/A'}</TableCell>
            <TableCell>{plan.frequency}</TableCell>
            <TableCell>{plan.autoCharge ? 'Yes' : 'No'}</TableCell>
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