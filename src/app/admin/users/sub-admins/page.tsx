"use client";

import { Box, Chip } from "@mui/material";
import { useMemo, useState } from "react";
import ListTable, { TableColumn } from "@/components/ui/ListTable";
import { mockUsers, UserRow } from "@/features/admin/users/data/mockUsers";
import SubAdminDialog, { SubAdminFormData } from "@/features/admin/subadmins/components/SubAdminDialog";
import { branchOptions } from "@/features/admin/partners/data/mockPartnerOptions";

const columns: TableColumn<UserRow>[] = [
  { id: "id", label: "Sub Admin ID", sortable: true },
  { id: "name", label: "Sub Admin Name", sortable: true, minWidth: 160 },
  { id: "email", label: "Email", sortable: true, minWidth: 200 },
  { id: "branch", label: "Branch", sortable: true },
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
  { id: "joined", label: "Joined", sortable: true },
];

export default function SubAdminsPage() {
  const subAdmins = useMemo(
    () => mockUsers.filter((row) => row.role === "Sub Admin"),
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

  const handleSave = (data: SubAdminFormData) => {
    console.log("save sub admin", data);
    setDialogOpen(false);
  };

  const initialData: Partial<SubAdminFormData> | undefined = editingRow
    ? {
        id: editingRow.id,
        fullName: editingRow.name,
        emailId: editingRow.email,
        branchId: branchOptions.find((option) => option.name === editingRow.branch)?.id ?? "",
        status: editingRow.status,
      }
    : undefined;

  return (
    <Box>
      <ListTable
        title="Sub Admins"
        subtitle="Manage sub admin access and branch assignments."
        rows={subAdmins}
        columns={columns}
        addLabel="Add Sub Admin"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(row) => console.log("delete sub admin", row)}
        onBulkDelete={(rows) => console.log("bulk delete sub admins", rows)}
        rowsPerPageOptions={[5, 10, 20]}
        searchPlaceholder="Search sub admins"
      />
      <SubAdminDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={initialData}
        onClose={handleClose}
        onSave={handleSave}
      />
    </Box>
  );
}
