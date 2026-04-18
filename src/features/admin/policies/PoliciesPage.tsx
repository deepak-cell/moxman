"use client";

import { Box, Chip } from "@mui/material";
import { useMemo, useState } from "react";
import ListTable, { TableColumn } from "@/components/ui/ListTable";
import PolicyDialog, { PolicyFormData } from "@/features/admin/products/components/PolicyDialog";
import { PolicyRow, mockPolicies } from "@/features/admin/products/data/mockPolicies";

const columns: TableColumn<PolicyRow>[] = [
  { id: "id", label: "Policy ID", sortable: true },
  { id: "policyName", label: "Policy Name", sortable: true, minWidth: 200 },
  { id: "policyType", label: "Type", sortable: true, minWidth: 120 },
  { id: "insurer", label: "Insurer", sortable: true, minWidth: 180 },
  { id: "premium", label: "Premium", sortable: true, align: "right", minWidth: 120 },
  { id: "commissionPercent", label: "Commission", sortable: true, align: "right", minWidth: 120 },
  {
    id: "status",
    label: "Status",
    sortable: true,
    render: (row) => (
      <Chip
        label={row.status}
        size="small"
        color={row.status === "Active" ? "success" : row.status === "Draft" ? "warning" : "default"}
        variant={row.status === "Active" ? "filled" : "outlined"}
      />
    ),
  },
  { id: "updatedAt", label: "Updated", sortable: true, minWidth: 120 },
];

function formatToday() {
  const date = new Date();
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<PolicyRow[]>(() => mockPolicies);

  const rows = useMemo(() => policies, [policies]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingRow, setEditingRow] = useState<PolicyRow | null>(null);

  const handleAdd = () => {
    setDialogMode("add");
    setEditingRow(null);
    setDialogOpen(true);
  };

  const handleEdit = (row: PolicyRow) => {
    setDialogMode("edit");
    setEditingRow(row);
    setDialogOpen(true);
  };

  const handleClose = () => setDialogOpen(false);

  const handleSave = (data: PolicyFormData) => {
    const payload: PolicyRow = {
      id: data.policyId.trim(),
      policyName: data.policyName.trim(),
      policyType: (data.policyType === "" ? "Health" : data.policyType) as PolicyRow["policyType"],
      insurer: data.insurer.trim(),
      premium: data.premium.trim(),
      commissionPercent: data.commissionPercent.trim(),
      status: data.status,
      updatedAt: formatToday(),
    };

    setPolicies((prev) => {
      if (dialogMode === "edit") return prev.map((row) => (row.id === payload.id ? payload : row));
      if (prev.some((row) => row.id === payload.id)) return prev.map((row) => (row.id === payload.id ? payload : row));
      return [payload, ...prev];
    });

    setDialogOpen(false);
  };

  const handleDelete = (row: PolicyRow) => setPolicies((prev) => prev.filter((r) => r.id !== row.id));

  const handleBulkDelete = (selectedRows: PolicyRow[]) => {
    const selected = new Set(selectedRows.map((row) => row.id));
    setPolicies((prev) => prev.filter((row) => !selected.has(row.id)));
  };

  const initialData: Partial<PolicyFormData> | undefined = editingRow
    ? {
        policyId: editingRow.id,
        policyName: editingRow.policyName,
        policyType: editingRow.policyType,
        insurer: editingRow.insurer,
        premium: editingRow.premium,
        commissionPercent: editingRow.commissionPercent,
        status: editingRow.status,
      }
    : undefined;

  return (
    <Box>
      <ListTable
        title="Policies"
        subtitle="Review issued policies, renewals, and lifecycle status."
        rows={rows}
        columns={columns}
        addLabel="Add Policy"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        rowsPerPageOptions={[5, 10, 20]}
        searchPlaceholder="Search policies"
      />
      <PolicyDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={initialData}
        onClose={handleClose}
        onSave={handleSave}
      />
    </Box>
  );
}
