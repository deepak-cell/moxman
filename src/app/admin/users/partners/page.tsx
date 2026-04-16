"use client";

import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import ListTable, { TableColumn } from "@/components/ui/ListTable";
import { mockUsers, UserRow } from "@/features/admin/users/data/mockUsers";
import PartnerDialog, { PartnerFormData } from "@/features/admin/partners/components/PartnerDialog";
import { branchOptions } from "@/features/admin/partners/data/mockPartnerOptions";

const columns: TableColumn<UserRow>[] = [
  { id: "id", label: "Partner ID", sortable: true },
  { id: "name", label: "Partner Name", sortable: true, minWidth: 160 },
  { id: "email", label: "Email", sortable: true, minWidth: 200 },
  { id: "branch", label: "Branch", sortable: true },
  { id: "status", label: "Status", sortable: true },
  { id: "joined", label: "Joined", sortable: true },
];

export default function PartnersPage() {
  const partners = useMemo(
    () => mockUsers.filter((row) => row.role === "Partner"),
    [],
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingRow, setEditingRow] = useState<UserRow | null>(null);

  const handleAdd = () => {
    setDialogMode("add");
    setEditingRow(null);
    setDialogOpen(true);
  };

  const handleEdit = (row: UserRow) => {
    setDialogMode("edit");
    setEditingRow(row);
    setDialogOpen(true);
  };

  const handleClose = () => setDialogOpen(false);

  const handleSave = (data: PartnerFormData) => {
    console.log("save partner", data);
    setDialogOpen(false);
  };

  const initialData: Partial<PartnerFormData> | undefined = editingRow
    ? {
        fullName: editingRow.name,
        emailId: editingRow.email,
        branchId: branchOptions.find((option) => option.name === editingRow.branch)?.id ?? "",
      }
    : undefined;

  return (
    <Box>
      <ListTable
        title="Partners"
        subtitle="Manage partner onboarding and assignments."
        rows={partners}
        columns={columns}
        addLabel="Add Partner"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(row) => console.log("delete partner", row)}
        onBulkDelete={(rows) => console.log("bulk delete partners", rows)}
        rowsPerPageOptions={[5, 10, 20]}
        searchPlaceholder="Search partners"
      />
      <PartnerDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={initialData}
        onClose={handleClose}
        onSave={handleSave}
      />
    </Box>
  );
}
