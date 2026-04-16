"use client";

import { Box, Chip, Typography } from "@mui/material";
import ListTable, { TableColumn } from "@/components/ui/ListTable";
import {
  PaymentRow,
  paymentHistory,
  pendingPayments,
} from "@/features/admin/payments/data/mockPayments";

const columns: TableColumn<PaymentRow>[] = [
  { id: "id", label: "Payment ID", sortable: true },
  { id: "partner", label: "Partner", sortable: true },
  { id: "customer", label: "Customer", sortable: true },
  { id: "amount", label: "Amount", sortable: true, align: "right" },
  { id: "dueDate", label: "Due Date", sortable: true },
  {
    id: "status",
    label: "Status",
    sortable: true,
    render: (row) => (
      <Chip
        label={row.status}
        size="small"
        color={row.status === "Paid" ? "success" : "warning"}
        variant={row.status === "Paid" ? "filled" : "outlined"}
      />
    ),
  },
  { id: "updatedAt", label: "Updated", sortable: true },
];

export default function PaymentsPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Payments
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review pending payouts and track completed payments.
        </Typography>
      </Box>

      <ListTable
        title="Pending Payments"
        subtitle="Approve and complete partner payouts."
        rows={pendingPayments}
        columns={columns}
        addLabel="Mark as Paid"
        addRequiresSelection
        onAdd={() => console.log("mark paid")}
        onEdit={(row) => console.log("edit pending", row)}
        onDelete={(row) => console.log("delete pending", row)}
        onBulkDelete={(rows) => console.log("bulk delete pending", rows)}
        rowsPerPageOptions={[5, 10, 20]}
        searchPlaceholder="Search pending payments"
      />

      <ListTable
        title="Payment History"
        subtitle="Completed payouts across partners."
        rows={paymentHistory}
        columns={columns}
        rowsPerPageOptions={[5, 10, 20]}
        searchPlaceholder="Search payment history"
      />
    </Box>
  );
}
