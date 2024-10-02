export type PaymentPlan = {
    id: number;  // Changed to number only for consistency
    customerName: string;
    type: string;
    totalAmount: number;
    installments: number | null;
    frequency: string;
    autoCharge: boolean;
  }