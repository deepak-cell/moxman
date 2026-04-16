"use client";

import { Box, Chip } from "@mui/material";
import { useMemo, useState } from "react";
import ListTable, { TableColumn } from "@/components/ui/ListTable";
import SlabDialog, { SlabFormData } from "@/features/admin/slabs/components/SlabDialog";
import {
  calculateTierPayout,
  incentivePlanDefaults,
  IncentiveTier,
  mockSlabs,
} from "@/features/admin/slabs/data/mockSlabs";

function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatToday() {
  const date = new Date();
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function nextSlabName(slabs: IncentiveTier[]) {
  const maxN = slabs.reduce((acc, slab) => {
    const match = /tier\s+(\d+)/i.exec(slab.name);
    const value = match ? Number(match[1]) : 0;
    return Number.isFinite(value) ? Math.max(acc, value) : acc;
  }, 0);
  return `Tier ${maxN + 1}`;
}

function nextSlabId(slabs: IncentiveTier[]) {
  const maxN = slabs.reduce((acc, slab) => {
    const match = /^s(\d+)$/i.exec(slab.id);
    const value = match ? Number(match[1]) : 0;
    return Number.isFinite(value) ? Math.max(acc, value) : acc;
  }, 0);
  return `s${maxN + 1}`;
}

type TierRow = IncentiveTier & {
  payoutAtMin: number;
  baseAtMin: number;
  incentiveAtMin: number;
};

const columns: TableColumn<TierRow>[] = [
  { id: "id", label: "Tier ID", sortable: true, minWidth: 90 },
  { id: "name", label: "Tier Name", sortable: true, minWidth: 140 },
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
    id: "commissionPercent",
    label: "Commission %",
    sortable: true,
    align: "right",
    minWidth: 130,
    render: (row) => `${row.commissionPercent}%`,
  },
  {
    id: "baseAtMin",
    label: "Base @ Min",
    sortable: false,
    align: "right",
    minWidth: 130,
    render: (row) => formatInr(row.baseAtMin),
  },
  {
    id: "incentiveAtMin",
    label: "Incentive @ Min",
    sortable: false,
    align: "right",
    minWidth: 160,
    render: (row) => formatInr(row.incentiveAtMin),
  },
  {
    id: "payoutAtMin",
    label: "Total Payout @ Min",
    sortable: false,
    align: "right",
    minWidth: 170,
    render: (row) => formatInr(row.payoutAtMin),
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

export default function SlabsPage({ actorRole }: { actorRole?: string | null }) {
  const [slabs, setSlabs] = useState<IncentiveTier[]>(() => mockSlabs);
  const rows = useMemo<TierRow[]>(
    () =>
      slabs.map((tier) => {
        const payout = calculateTierPayout({
          clients: tier.minClients,
          commissionPercent: tier.commissionPercent,
        });
        return {
          ...tier,
          payoutAtMin: payout.totalPayout,
          baseAtMin: payout.basePay,
          incentiveAtMin: payout.incentivePayout,
        };
      }),
    [slabs]
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingRow, setEditingRow] = useState<IncentiveTier | null>(null);
  const [dialogDefaults, setDialogDefaults] = useState<Partial<SlabFormData> | undefined>(undefined);

  const handleAdd = () => {
    setDialogMode("add");
    setEditingRow(null);
    setDialogDefaults({
      name: nextSlabName(slabs),
      isActive: true,
    });
    setDialogOpen(true);
  };

  const handleEdit = (row: TierRow) => {
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
        const updated: IncentiveTier = {
          ...editingRow,
          name: data.name,
          minClients: data.minClients,
          maxClients: data.maxClients,
          commissionPercent: data.commissionPercent,
          isActive: data.isActive,
          updatedAt: now,
        };
        return prev.map((row) => (row.id === editingRow.id ? updated : row));
      }

      const id = nextSlabId(prev);
      const created: IncentiveTier = {
        id,
        name: data.name,
        minClients: data.minClients,
        maxClients: data.maxClients,
        commissionPercent: data.commissionPercent,
        isActive: data.isActive,
        createdAt: now,
        updatedAt: now,
      };
      return [created, ...prev];
    });

    setDialogOpen(false);
  };

  const handleDelete = (row: TierRow) => setSlabs((prev) => prev.filter((s) => s.id !== row.id));

  const handleBulkDelete = (selectedRows: TierRow[]) => {
    const selected = new Set(selectedRows.map((row) => row.id));
    setSlabs((prev) => prev.filter((row) => !selected.has(row.id)));
  };

  const initialData: Partial<SlabFormData> | undefined = editingRow
    ? {
        id: editingRow.id,
        name: editingRow.name,
        minClients: editingRow.minClients,
        maxClients: editingRow.maxClients,
        commissionPercent: editingRow.commissionPercent,
        isActive: editingRow.isActive,
      }
    : dialogDefaults;

  return (
    <Box>
      <ListTable
        title="Incentive Tiers"
        subtitle={`Base pay is fixed at ₹${incentivePlanDefaults.basePayPerClient}/client. Tiers control incentives via Commission %.`}
        rows={rows}
        columns={columns}
        addLabel="Add Tier"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        rowsPerPageOptions={[5, 10, 20]}
        searchPlaceholder="Search tiers"
      />
      <SlabDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={initialData}
        actorRole={actorRole}
        onClose={handleClose}
        onSave={handleSave}
      />
    </Box>
  );
}
