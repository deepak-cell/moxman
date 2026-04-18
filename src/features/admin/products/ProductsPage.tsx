"use client";

import { Box, Chip } from "@mui/material";
import { useMemo, useState } from "react";
import ListTable, { TableColumn } from "@/components/ui/ListTable";
import ProductDialog, { ProductFormData } from "@/features/admin/products/components/ProductDialog";
import { ProductRow, mockProducts } from "@/features/admin/products/data/mockProducts";

const columns: TableColumn<ProductRow>[] = [
  { id: "id", label: "Product ID", sortable: true },
  { id: "policyName", label: "Product Name", sortable: true, minWidth: 200 },
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

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>(() => mockProducts);

  const rows = useMemo(() => products, [products]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingRow, setEditingRow] = useState<ProductRow | null>(null);

  const handleAdd = () => {
    setDialogMode("add");
    setEditingRow(null);
    setDialogOpen(true);
  };

  const handleEdit = (row: ProductRow) => {
    setDialogMode("edit");
    setEditingRow(row);
    setDialogOpen(true);
  };

  const handleClose = () => setDialogOpen(false);

  const handleSave = (data: ProductFormData) => {
    const payload: ProductRow = {
      id: data.policyId.trim(),
      policyName: data.policyName.trim(),
      policyType: (data.policyType === "" ? "Health" : data.policyType) as ProductRow["policyType"],
      insurer: data.insurer.trim(),
      premium: data.premium.trim(),
      commissionPercent: data.commissionPercent.trim(),
      status: data.status,
      updatedAt: formatToday(),
    };

    setProducts((prev) => {
      if (dialogMode === "edit") return prev.map((row) => (row.id === payload.id ? payload : row));
      if (prev.some((row) => row.id === payload.id)) return prev.map((row) => (row.id === payload.id ? payload : row));
      return [payload, ...prev];
    });

    setDialogOpen(false);
  };

  const handleDelete = (row: ProductRow) => setProducts((prev) => prev.filter((r) => r.id !== row.id));

  const handleBulkDelete = (selectedRows: ProductRow[]) => {
    const selected = new Set(selectedRows.map((row) => row.id));
    setProducts((prev) => prev.filter((row) => !selected.has(row.id)));
  };

  const initialData: Partial<ProductFormData> | undefined = editingRow
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
        title="Products"
        subtitle="Review issued products, renewals, and lifecycle status."
        rows={rows}
        columns={columns}
        addLabel="Add Product"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        rowsPerPageOptions={[5, 10, 20]}
        searchPlaceholder="Search products"
      />
      <ProductDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={initialData}
        onClose={handleClose}
        onSave={handleSave}
      />
    </Box>
  );
}
