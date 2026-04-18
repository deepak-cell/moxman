"use client";

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import CtaButton from "@/components/ui/CtaButton";

export type PolicyFormData = {
  id?: string;
  policyId: string;
  policyName: string;
  policyType: "Health" | "Motor" | "Life" | "";
  insurer: string;
  premium: string;
  commissionPercent: string;
  status: "Draft" | "Active" | "Inactive";
};

type PolicyDialogProps = {
  open: boolean;
  mode: "add" | "edit";
  initialData?: Partial<PolicyFormData>;
  onClose: () => void;
  onSave: (data: PolicyFormData) => void;
};

const emptyForm: PolicyFormData = {
  policyId: "",
  policyName: "",
  policyType: "",
  insurer: "",
  premium: "",
  commissionPercent: "",
  status: "Draft",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.5rem",
    height: 48,
  },
  "& .MuiInputLabel-outlined": {
    transform: "translate(14px, 13px) scale(1)",
  },
  "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
    transform: "translate(14px, -9px) scale(0.75)",
  },
};

const sectionTitleSx = {
  fontWeight: 700,
  fontSize: 14,
  letterSpacing: "0.02em",
  color: "text.primary",
};

export default function PolicyDialog({
  open,
  mode,
  initialData,
  onClose,
  onSave,
}: PolicyDialogProps) {
  const mergedInitial = useMemo(
    () => ({ ...emptyForm, ...initialData }) as PolicyFormData,
    [initialData],
  );
  const [form, setForm] = useState<PolicyFormData>(mergedInitial);

  const setField = <K extends keyof PolicyFormData>(key: K, value: PolicyFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canSave =
    form.policyId.trim() !== "" &&
    form.policyName.trim() !== "" &&
    form.policyType !== "" &&
    form.insurer.trim() !== "" &&
    form.status.trim() !== "";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        transition: {
          onEntering: () => setForm(mergedInitial),
        },
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        {mode === "add" ? "Add Product" : "Edit Product"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography sx={sectionTitleSx}>Product Details</Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Product ID"
            value={form.policyId}
            onChange={(e) => setField("policyId", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            placeholder="PRD-2004"
            disabled={mode === "edit"}
          />

          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="policy-status-label">Status</InputLabel>
            <Select
              labelId="policy-status-label"
              label="Status"
              value={form.status}
              onChange={(e) => setField("status", e.target.value as PolicyFormData["status"])}
            >
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Product Name"
            value={form.policyName}
            onChange={(e) => setField("policyName", e.target.value)}
            fullWidth
            required
            sx={{ ...fieldSx, gridColumn: { sm: "1 / -1" } }}
            placeholder="Enter product name"
          />

          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="policy-type-label">Product Type</InputLabel>
            <Select
              labelId="policy-type-label"
              label="Product Type"
              value={form.policyType}
              onChange={(e) => setField("policyType", e.target.value as PolicyFormData["policyType"])}
            >
              <MenuItem value="Health">Health</MenuItem>
              <MenuItem value="Motor">Motor</MenuItem>
              <MenuItem value="Life">Life</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Insurer"
            value={form.insurer}
            onChange={(e) => setField("insurer", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            placeholder="Enter insurer name"
          />

          <TextField
            label="Premium (optional)"
            value={form.premium}
            onChange={(e) => setField("premium", e.target.value)}
            fullWidth
            sx={fieldSx}
            placeholder="₹12,499"
          />

          <TextField
            label="Commission % (optional)"
            value={form.commissionPercent}
            onChange={(e) => setField("commissionPercent", e.target.value)}
            fullWidth
            sx={fieldSx}
            placeholder="12%"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <CtaButton variant="outlined" onClick={onClose}>
          Cancel
        </CtaButton>
        <CtaButton variant="role" onClick={() => onSave(form)} disabled={!canSave}>
          {mode === "add" ? "Save Product" : "Update Product"}
        </CtaButton>
      </DialogActions>
    </Dialog>
  );
}
