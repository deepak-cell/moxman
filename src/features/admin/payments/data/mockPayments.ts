export type PaymentRow = {
  id: string;
  partner: string;
  customer: string;
  amount: string;
  dueDate: string;
  status: "Pending" | "Paid";
  updatedAt: string;
};

export const pendingPayments: PaymentRow[] = [
  {
    id: "PAY-1001",
    partner: "Partner A",
    customer: "Riya Sharma",
    amount: "₹9,000",
    dueDate: "18 Apr 2026",
    status: "Pending",
    updatedAt: "15 Apr 2026",
  },
  {
    id: "PAY-1002",
    partner: "Partner C",
    customer: "Arjun Mehta",
    amount: "₹7,500",
    dueDate: "20 Apr 2026",
    status: "Pending",
    updatedAt: "16 Apr 2026",
  },
  {
    id: "PAY-1003",
    partner: "Partner B",
    customer: "Meera Iyer",
    amount: "₹12,000",
    dueDate: "21 Apr 2026",
    status: "Pending",
    updatedAt: "16 Apr 2026",
  },
];

export const paymentHistory: PaymentRow[] = [
  {
    id: "PAY-0901",
    partner: "Partner A",
    customer: "Vikram Patel",
    amount: "₹9,000",
    dueDate: "12 Apr 2026",
    status: "Paid",
    updatedAt: "12 Apr 2026",
  },
  {
    id: "PAY-0902",
    partner: "Partner D",
    customer: "Sara Khan",
    amount: "₹7,500",
    dueDate: "10 Apr 2026",
    status: "Paid",
    updatedAt: "10 Apr 2026",
  },
  {
    id: "PAY-0903",
    partner: "Partner C",
    customer: "Rahul Singh",
    amount: "₹17,000",
    dueDate: "08 Apr 2026",
    status: "Paid",
    updatedAt: "08 Apr 2026",
  },
];
