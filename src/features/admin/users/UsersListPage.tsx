"use client";

import { Box, Chip } from "@mui/material";
import { useMemo } from "react";
import ListTable, { TableColumn } from "@/components/ui/ListTable";
import { mockUsers, UserRow } from "@/features/admin/users/data/mockUsers";

export type UserRoleKey = "all" | "partner" | "relationship_manager" | "branch_manager" | "sub_admin";

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

const roleLabelMap: Record<UserRoleKey, string> = {
  all: "All Users",
  partner: "Partners",
  relationship_manager: "Relationship Managers",
  branch_manager: "Branch Managers",
  sub_admin: "Sub Admins",
};

const roleMatchMap: Record<Exclude<UserRoleKey, "all">, string> = {
  partner: "Partner",
  relationship_manager: "Relationship Manager",
  branch_manager: "Branch Manager",
  sub_admin: "Sub Admin",
};

export default function UsersListPage({ role }: { role: UserRoleKey }) {
  const filteredRows = useMemo(() => {
    if (role === "all") return mockUsers;
    const matchRole = roleMatchMap[role];
    return mockUsers.filter((row) => row.role === matchRole);
  }, [role]);

  const title = roleLabelMap[role] ?? "Users";
  const subtitle =
    role === "all"
      ? "Manage admins, branch managers, RMs, and partners."
      : `Manage ${title.toLowerCase()}.`;

  const addLabel = role === "all" ? "Add User" : `Add ${title.slice(0, -1)}`;

  return (
    <Box>
      <ListTable
        title={title}
        subtitle={subtitle}
        rows={filteredRows}
        columns={columns}
        addLabel={addLabel}
        onAdd={() => console.log("add user")}
        onEdit={(row) => console.log("edit user", row)}
        onDelete={(row) => console.log("delete user", row)}
        onBulkDelete={(rows) => console.log("bulk delete", rows)}
        rowsPerPageOptions={[5, 10, 20]}
        searchPlaceholder={`Search ${title.toLowerCase()}`}
      />
    </Box>
  );
}
