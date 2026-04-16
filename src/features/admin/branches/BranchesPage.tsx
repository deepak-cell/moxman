"use client";

import { Box, Chip } from "@mui/material";
import { useMemo, useState } from "react";
import ListTable, { TableColumn } from "@/components/ui/ListTable";
import BranchDialog, { BranchFormData } from "@/features/admin/branches/components/BranchDialog";
import { BranchRow, mockBranches } from "@/features/admin/branches/data/mockBranches";

const columns: TableColumn<BranchRow>[] = [
  { id: "id", label: "Branch Code", sortable: true },
  { id: "name", label: "Branch Name", sortable: true, minWidth: 180 },
  { id: "city", label: "City", sortable: true },
  { id: "state", label: "State", sortable: true, minWidth: 140 },
  {
    id: "status",
    label: "Status",
    sortable: true,
    render: (row) => (
      <Chip
        label={row.status}
        size="small"
        color={row.status === "Active" ? "success" : "default"}
        variant={row.status === "Active" ? "filled" : "outlined"}
      />
    ),
  },
  { id: "createdAt", label: "Created", sortable: true, minWidth: 120 },
];

function formatToday() {
  const date = new Date();
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<BranchRow[]>(() => mockBranches);

  const rows = useMemo(() => branches, [branches]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingRow, setEditingRow] = useState<BranchRow | null>(null);

  const handleAdd = () => {
    setDialogMode("add");
    setEditingRow(null);
    setDialogOpen(true);
  };

  const handleEdit = (row: BranchRow) => {
    setDialogMode("edit");
    setEditingRow(row);
    setDialogOpen(true);
  };

  const handleClose = () => setDialogOpen(false);

  const handleSave = (data: BranchFormData) => {
    const payload: BranchRow = {
      id: data.branchCode.trim(),
      name: data.branchName.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      status: data.status,
      createdAt: dialogMode === "add" ? formatToday() : (editingRow?.createdAt ?? formatToday()),
      addressLine: data.addressLine.trim(),
      pincode: data.pincode.trim(),
    };

    setBranches((prev) => {
      if (dialogMode === "edit") {
        return prev.map((row) => (row.id === payload.id ? payload : row));
      }
      if (prev.some((row) => row.id === payload.id)) {
        // Keep it simple in the mock UI: treat duplicate code as an update.
        return prev.map((row) => (row.id === payload.id ? payload : row));
      }
      return [payload, ...prev];
    });

    setDialogOpen(false);
  };

  const handleDelete = (row: BranchRow) => setBranches((prev) => prev.filter((r) => r.id !== row.id));

  const handleBulkDelete = (selectedRows: BranchRow[]) => {
    const selected = new Set(selectedRows.map((row) => row.id));
    setBranches((prev) => prev.filter((row) => !selected.has(row.id)));
  };

  const initialData: Partial<BranchFormData> | undefined = editingRow
    ? {
        branchCode: editingRow.id,
        branchName: editingRow.name,
        addressLine: editingRow.addressLine,
        city: editingRow.city,
        state: editingRow.state,
        pincode: editingRow.pincode,
        status: editingRow.status,
      }
    : undefined;

  return (
    <Box>
      <ListTable
        title="Branches"
        subtitle="Create and manage branches used for user assignments."
        rows={rows}
        columns={columns}
        addLabel="Add Branch"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        rowsPerPageOptions={[5, 10, 20]}
        searchPlaceholder="Search branches"
      />
      <BranchDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={initialData}
        onClose={handleClose}
        onSave={handleSave}
      />
    </Box>
  );
}

