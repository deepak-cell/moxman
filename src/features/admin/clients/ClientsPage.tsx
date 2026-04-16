"use client";

import { Box, Chip } from "@mui/material";
import { useMemo, useState } from "react";
import ListTable, { TableColumn } from "@/components/ui/ListTable";
import ClientDialog, { ClientFormData } from "@/features/admin/clients/components/ClientDialog";
import { ClientRow, mockClients } from "@/features/admin/clients/data/mockClients";
import { branchOptions } from "@/features/admin/partners/data/mockPartnerOptions";

const columns: TableColumn<ClientRow>[] = [
  { id: "id", label: "Client ID", sortable: true },
  { id: "fullName", label: "Client Name", sortable: true, minWidth: 180 },
  { id: "phoneNumber", label: "Phone", sortable: true, minWidth: 140 },
  { id: "emailId", label: "Email", sortable: true, minWidth: 220 },
  { id: "partner", label: "Partner", sortable: true, minWidth: 140 },
  { id: "branch", label: "Branch", sortable: true },
  { id: "policy", label: "Policy", sortable: true, minWidth: 180 },
  {
    id: "status",
    label: "Status",
    sortable: true,
    render: (row) => {
      const color = row.status === "Active" ? "success" : row.status === "Pending" ? "warning" : "default";
      const variant = row.status === "Active" ? "filled" : "outlined";
      return <Chip label={row.status} size="small" color={color} variant={variant} />;
    },
  },
  { id: "createdAt", label: "Created", sortable: true, minWidth: 120 },
];

function formatToday() {
  const date = new Date();
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>(() => mockClients);

  const rows = useMemo(() => clients, [clients]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingRow, setEditingRow] = useState<ClientRow | null>(null);

  const handleAdd = () => {
    setDialogMode("add");
    setEditingRow(null);
    setDialogOpen(true);
  };

  const handleEdit = (row: ClientRow) => {
    setDialogMode("edit");
    setEditingRow(row);
    setDialogOpen(true);
  };

  const handleClose = () => setDialogOpen(false);

  const handleSave = (data: ClientFormData) => {
    const branchName = branchOptions.find((option) => option.id === data.branchId)?.name ?? "";
    const payload: ClientRow = {
      id: data.clientId.trim(),
      fullName: data.fullName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      emailId: data.emailId.trim(),
      branch: branchName,
      partner: data.partnerName.trim(),
      policy: data.policyName.trim(),
      status: data.status,
      createdAt: dialogMode === "add" ? formatToday() : (editingRow?.createdAt ?? formatToday()),
    };

    setClients((prev) => {
      if (dialogMode === "edit") return prev.map((row) => (row.id === payload.id ? payload : row));
      if (prev.some((row) => row.id === payload.id)) return prev.map((row) => (row.id === payload.id ? payload : row));
      return [payload, ...prev];
    });

    setDialogOpen(false);
  };

  const handleDelete = (row: ClientRow) => setClients((prev) => prev.filter((r) => r.id !== row.id));

  const handleBulkDelete = (selectedRows: ClientRow[]) => {
    const selected = new Set(selectedRows.map((row) => row.id));
    setClients((prev) => prev.filter((row) => !selected.has(row.id)));
  };

  const initialData: Partial<ClientFormData> | undefined = editingRow
    ? {
        clientId: editingRow.id,
        fullName: editingRow.fullName,
        phoneNumber: editingRow.phoneNumber,
        emailId: editingRow.emailId,
        branchId: branchOptions.find((option) => option.name === editingRow.branch)?.id ?? "",
        partnerName: editingRow.partner,
        policyName: editingRow.policy,
        status: editingRow.status,
      }
    : undefined;

  return (
    <Box>
      <ListTable
        title="Clients"
        subtitle="Track client profiles, status, and policy activity."
        rows={rows}
        columns={columns}
        addLabel="Add Client"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        rowsPerPageOptions={[5, 10, 20]}
        searchPlaceholder="Search clients"
      />
      <ClientDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={initialData}
        onClose={handleClose}
        onSave={handleSave}
      />
    </Box>
  );
}
