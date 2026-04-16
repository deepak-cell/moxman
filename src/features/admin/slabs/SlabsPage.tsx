"use client";

import { Box, Chip } from "@mui/material";
import { useMemo, useState } from "react";
import ListTable, { TableColumn } from "@/components/ui/ListTable";
import SlabDialog, { SlabFormData } from "@/features/admin/slabs/components/SlabDialog";
import { mockSlabs, Slab } from "@/features/admin/slabs/data/mockSlabs";

function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatToday() {
  const date = new Date();
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function nextSlabName(slabs: Slab[]) {
  const maxN = slabs.reduce((acc, slab) => {
    const match = /slab\s+(\d+)/i.exec(slab.name);
    const value = match ? Number(match[1]) : 0;
    return Number.isFinite(value) ? Math.max(acc, value) : acc;
  }, 0);
  return `Slab ${maxN + 1}`;
}

function nextSlabId(slabs: Slab[]) {
  const maxN = slabs.reduce((acc, slab) => {
    const match = /^s(\d+)$/i.exec(slab.id);
    const value = match ? Number(match[1]) : 0;
    return Number.isFinite(value) ? Math.max(acc, value) : acc;
  }, 0);
  return `s${maxN + 1}`;
}

const columns: TableColumn<Slab>[] = [
  { id: "id", label: "Slab ID", sortable: true, minWidth: 90 },
  { id: "name", label: "Slab Name", sortable: true, minWidth: 140 },
  { id: "minClients", label: "Min Clients", sortable: true, align: "right", minWidth: 110 },
  {
    id: "maxClients",
    label: "Max Clients",
    sortable: true,
    align: "right",
    minWidth: 110,
    render: (row) => (row.maxClients == null ? "No cap" : String(Math.max(0, row.maxClients - 1))),
  },
  {
    id: "payoutAmount",
    label: "Payout Amount",
    sortable: true,
    align: "right",
    minWidth: 140,
    render: (row) => formatInr(row.payoutAmount),
  },
  {
    id: "baseRatePerClient",
    label: "Base Rate/Client",
    sortable: true,
    align: "right",
    minWidth: 140,
    render: (row) => formatInr(row.baseRatePerClient),
  },
  {
    id: "isActive",
    label: "Status",
    sortable: true,
    minWidth: 110,
    render: (row) => (
      <Chip
        label={row.isActive ? "Active" : "Inactive"}
        size="small"
        color={row.isActive ? "success" : "default"}
        variant={row.isActive ? "filled" : "outlined"}
      />
    ),
  },
];

export default function SlabsPage() {
  const [slabs, setSlabs] = useState<Slab[]>(() => mockSlabs);
  const rows = useMemo(() => slabs, [slabs]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingRow, setEditingRow] = useState<Slab | null>(null);
  const [dialogDefaults, setDialogDefaults] = useState<Partial<SlabFormData> | undefined>(undefined);

  const handleAdd = () => {
    setDialogMode("add");
    setEditingRow(null);
    setDialogDefaults({
      name: nextSlabName(slabs),
      baseRatePerClient: 750,
      isActive: true,
    });
    setDialogOpen(true);
  };

  const handleEdit = (row: Slab) => {
    setDialogMode("edit");
    setEditingRow(row);
    setDialogDefaults(undefined);
    setDialogOpen(true);
  };

  const handleClose = () => setDialogOpen(false);

  const handleSave = (data: SlabFormData) => {
    const now = formatToday();

    setSlabs((prev) => {
      if (dialogMode === "edit" && editingRow) {
        const updated: Slab = {
          ...editingRow,
          name: data.name,
          minClients: data.minClients,
          maxClients: data.maxClients,
          payoutAmount: data.payoutAmount,
          baseRatePerClient: data.baseRatePerClient,
          isActive: data.isActive,
          updatedAt: now,
        };
        return prev.map((row) => (row.id === editingRow.id ? updated : row));
      }

      const id = nextSlabId(prev);
      const created: Slab = {
        id,
        name: data.name,
        minClients: data.minClients,
        maxClients: data.maxClients,
        payoutAmount: data.payoutAmount,
        baseRatePerClient: data.baseRatePerClient,
        isActive: data.isActive,
        createdAt: now,
        updatedAt: now,
      };
      return [created, ...prev];
    });

    setDialogOpen(false);
  };

  const handleDelete = (row: Slab) => setSlabs((prev) => prev.filter((s) => s.id !== row.id));

  const handleBulkDelete = (selectedRows: Slab[]) => {
    const selected = new Set(selectedRows.map((row) => row.id));
    setSlabs((prev) => prev.filter((row) => !selected.has(row.id)));
  };

  const initialData: Partial<SlabFormData> | undefined = editingRow
    ? {
        id: editingRow.id,
        name: editingRow.name,
        minClients: editingRow.minClients,
        maxClients: editingRow.maxClients,
        payoutAmount: editingRow.payoutAmount,
        baseRatePerClient: editingRow.baseRatePerClient,
        isActive: editingRow.isActive,
      }
    : dialogDefaults;

  return (
    <Box>
      <ListTable
        title="Slabs"
        subtitle="Configure slab thresholds and payouts."
        rows={rows}
        columns={columns}
        addLabel="Add Slab"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        rowsPerPageOptions={[5, 10, 20]}
        searchPlaceholder="Search slabs"
      />
      <SlabDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={initialData}
        onClose={handleClose}
        onSave={handleSave}
      />
    </Box>
  );
}
