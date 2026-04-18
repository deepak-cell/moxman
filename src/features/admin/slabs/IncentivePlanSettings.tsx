"use client";

import { Box, Chip } from "@mui/material";
import { useMemo, useState } from "react";
import ListTable, { TableColumn } from "@/components/ui/ListTable";
import IncentivePlanSettingsDialog from "@/features/admin/slabs/components/IncentivePlanSettingsDialog";
import {
  deriveMinCommissionPercent,
  IncentivePlanSettings,
  IncentivePlanSettingsFormData,
  mockIncentivePlanSettings,
} from "@/features/admin/slabs/data/mockIncentivePlanSettings";

function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatToday() {
  const date = new Date();
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function nextPlanId(plans: IncentivePlanSettings[]) {
  const maxN = plans.reduce((acc, plan) => {
    const match = /^plan-(\d+)$/i.exec(plan.id);
    const value = match ? Number(match[1]) : 0;
    return Number.isFinite(value) ? Math.max(acc, value) : acc;
  }, 0);
  return `plan-${maxN + 1}`;
}

type PlanRow = IncentivePlanSettings & {
  minCommissionPercent: number;
};

const columns: TableColumn<PlanRow>[] = [
  { id: "id", label: "Plan ID", sortable: true, minWidth: 100 },
  {
    id: "basePayPerClient",
    label: "Base Pay / Client",
    sortable: true,
    align: "right",
    minWidth: 150,
    render: (row) => formatInr(row.basePayPerClient),
  },
  {
    id: "incentiveBasePerClient",
    label: "Incentive Base / Client",
    sortable: true,
    align: "right",
    minWidth: 180,
    render: (row) => formatInr(row.incentiveBasePerClient),
  },
  {
    id: "minCommissionPercent",
    label: "Min Commission %",
    sortable: true,
    align: "right",
    minWidth: 160,
    render: (row) => `${row.minCommissionPercent.toFixed(2)}%`,
  },
  {
    id: "over200ClientsThreshold",
    label: "High Vol. Threshold",
    sortable: true,
    align: "right",
    minWidth: 160,
    render: (row) => `>${row.over200ClientsThreshold} clients`,
  },
  {
    id: "over200ClientsPercent",
    label: "High Vol. Commission %",
    sortable: true,
    align: "right",
    minWidth: 180,
    render: (row) => `${row.over200ClientsPercent}%`,
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
  { id: "updatedAt", label: "Last Updated", sortable: true, minWidth: 140 },
];

export default function IncentivePlanSettingsPage({ actorRole }: { actorRole?: string | null }) {
  const [plans, setPlans] = useState<IncentivePlanSettings[]>(() => mockIncentivePlanSettings);

  const rows = useMemo<PlanRow[]>(
    () =>
      plans.map((plan) => ({
        ...plan,
        minCommissionPercent: deriveMinCommissionPercent(plan),
      })),
    [plans]
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingRow, setEditingRow] = useState<IncentivePlanSettings | null>(null);
  const [dialogDefaults, setDialogDefaults] = useState<
    Partial<IncentivePlanSettingsFormData> | undefined
  >(undefined);

  const handleAdd = () => {
    setDialogMode("add");
    setEditingRow(null);
    setDialogDefaults({ isActive: true });
    setDialogOpen(true);
  };

  const handleEdit = (row: PlanRow) => {
    setDialogMode("edit");
    setEditingRow(row);
    setDialogDefaults(undefined);
    setDialogOpen(true);
  };

  const handleClose = () => setDialogOpen(false);

  const handleSave = (data: IncentivePlanSettingsFormData) => {
    const now = formatToday();

    setPlans((prev) => {
      if (dialogMode === "edit" && editingRow) {
        const updated: IncentivePlanSettings = {
          ...editingRow,
          basePayPerClient: data.basePayPerClient,
          incentiveBasePerClient: data.incentiveBasePerClient,
          over200ClientsThreshold: data.over200ClientsThreshold,
          over200ClientsPercent: data.over200ClientsPercent,
          isActive: data.isActive,
          updatedAt: now,
        };
        return prev.map((p) => (p.id === editingRow.id ? updated : p));
      }

      const created: IncentivePlanSettings = {
        id: nextPlanId(prev),
        basePayPerClient: data.basePayPerClient,
        incentiveBasePerClient: data.incentiveBasePerClient,
        over200ClientsThreshold: data.over200ClientsThreshold,
        over200ClientsPercent: data.over200ClientsPercent,
        isActive: data.isActive,
        createdAt: now,
        updatedAt: now,
      };
      return [created, ...prev];
    });

    setDialogOpen(false);
  };

  const handleDelete = (row: PlanRow) =>
    setPlans((prev) => prev.filter((p) => p.id !== row.id));

  const handleBulkDelete = (selectedRows: PlanRow[]) => {
    const selected = new Set(selectedRows.map((row) => row.id));
    setPlans((prev) => prev.filter((p) => !selected.has(p.id)));
  };

  const initialData: Partial<IncentivePlanSettingsFormData> | undefined = editingRow
    ? {
        id: editingRow.id,
        basePayPerClient: editingRow.basePayPerClient,
        incentiveBasePerClient: editingRow.incentiveBasePerClient,
        over200ClientsThreshold: editingRow.over200ClientsThreshold,
        over200ClientsPercent: editingRow.over200ClientsPercent,
        isActive: editingRow.isActive,
      }
    : dialogDefaults;

  return (
    <Box>
      <ListTable
        title="Incentive Plan Settings"
        subtitle="Configure the base pay structure and high-volume commission rules. Tier commission % limits are derived from these values."
        rows={rows}
        columns={columns}
        addLabel="Add Plan"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        rowsPerPageOptions={[5, 10, 20]}
        searchPlaceholder="Search plans"
      />
      <IncentivePlanSettingsDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={initialData}
        onClose={handleClose}
        onSave={handleSave}
      />
    </Box>
  );
}