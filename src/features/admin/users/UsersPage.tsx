"use client";

import { Box, Chip } from "@mui/material";
import ListTable, { TableColumn } from "@/components/ui/ListTable";
import { mockUsers, UserRow } from "@/features/admin/users/data/mockUsers";

const columns: TableColumn<UserRow>[] = [
  { id: "id", label: "User ID", sortable: true },
  { id: "name", label: "Name", sortable: true, minWidth: 160 },
  { id: "email", label: "Email", sortable: true, minWidth: 200 },
  { id: "role", label: "Role", sortable: true },
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

export default function UsersPage() {
  return (
    <Box>
      <ListTable
        title="Users"
        subtitle="Manage admins, branch managers, RMs, and partners."
        rows={mockUsers}
        columns={columns}
        addLabel="Add User"
        onAdd={() => console.log("add user")}
        onEdit={(row) => console.log("edit user", row)}
        onDelete={(row) => console.log("delete user", row)}
        onBulkDelete={(rows) => console.log("bulk delete", rows)}
        rowsPerPageOptions={[5, 10, 20]}
        searchPlaceholder="Search users"
      />
    </Box>
  );
}
