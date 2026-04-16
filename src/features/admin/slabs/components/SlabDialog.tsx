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

export type SlabFormData = {
  id?: string;
  name: string;
  minClients: number;
  maxClients: number | null; // exclusive upper bound
  payoutAmount: number;
  baseRatePerClient: number;
  isActive: boolean;
};

type SlabDialogProps = {
  open: boolean;
  mode: "add" | "edit";
  initialData?: Partial<SlabFormData>;
  onClose: () => void;
  onSave: (data: SlabFormData) => void;
};

type SlabDialogState = {
  name: string;
  minClients: string;
  maxClientsInclusive: string; // empty = no cap
  payoutAmount: string;
  baseRatePerClient: string;
  status: "Active" | "Inactive";
};

const emptyForm: SlabDialogState = {
  name: "",
  minClients: "",
  maxClientsInclusive: "",
  payoutAmount: "",
  baseRatePerClient: "750",
  status: "Active",
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

function toInitialState(data?: Partial<SlabFormData>): SlabDialogState {
  const maxInclusive =
    data?.maxClients == null ? "" : String(Math.max(0, data.maxClients - 1));

  return {
    ...emptyForm,
    name: data?.name ?? emptyForm.name,
    minClients: data?.minClients != null ? String(data.minClients) : emptyForm.minClients,
    maxClientsInclusive: maxInclusive,
    payoutAmount: data?.payoutAmount != null ? String(data.payoutAmount) : emptyForm.payoutAmount,
    baseRatePerClient:
      data?.baseRatePerClient != null ? String(data.baseRatePerClient) : emptyForm.baseRatePerClient,
    status: data?.isActive === false ? "Inactive" : "Active",
  };
}

function parsePositiveInt(value: string) {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  const int = Math.floor(parsed);
  return int > 0 ? int : null;
}

function parseNonNegativeInt(value: string) {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  const int = Math.floor(parsed);
  return int >= 0 ? int : null;
}

function parseNonNegativeNumber(value: string) {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed >= 0 ? parsed : null;
}

export default function SlabDialog({
  open,
  mode,
  initialData,
  onClose,
  onSave,
}: SlabDialogProps) {
  const mergedInitial = useMemo(() => toInitialState(initialData), [initialData]);
  const [form, setForm] = useState<SlabDialogState>(mergedInitial);

  const setField = <K extends keyof SlabDialogState>(key: K, value: SlabDialogState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const minClients = parsePositiveInt(form.minClients);
  const maxClientsInclusive = parseNonNegativeInt(form.maxClientsInclusive);
  const payoutAmount = parseNonNegativeNumber(form.payoutAmount);
  const baseRatePerClient = parseNonNegativeNumber(form.baseRatePerClient);

  const isMaxValid =
    maxClientsInclusive == null || (minClients != null && maxClientsInclusive >= minClients);

  const canSave =
    form.name.trim() !== "" &&
    minClients != null &&
    payoutAmount != null &&
    baseRatePerClient != null &&
    isMaxValid;

  const handleSave = () => {
    if (!canSave || minClients == null || payoutAmount == null || baseRatePerClient == null) return;
    const maxExclusive =
      form.maxClientsInclusive.trim() === "" ? null : (maxClientsInclusive ?? minClients) + 1;

    onSave({
      id: initialData?.id,
      name: form.name.trim(),
      minClients,
      maxClients: maxExclusive,
      payoutAmount,
      baseRatePerClient,
      isActive: form.status === "Active",
    });
  };

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
        {mode === "add" ? "Add Slab" : "Edit Slab"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography sx={sectionTitleSx}>Slab Info</Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Slab Name"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            fullWidth
            required
            sx={{ ...fieldSx, gridColumn: { sm: "1 / -1" } }}
            placeholder="Slab 5"
          />

          <TextField
            label="Min Clients"
            value={form.minClients}
            onChange={(e) => setField("minClients", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            inputMode="numeric"
            placeholder="10"
          />

          <TextField
            label="Max Clients (optional)"
            value={form.maxClientsInclusive}
            onChange={(e) => setField("maxClientsInclusive", e.target.value)}
            fullWidth
            sx={fieldSx}
            inputMode="numeric"
            placeholder="Leave empty for No Cap"
            error={!isMaxValid}
            helperText={!isMaxValid ? "Max Clients must be greater than or equal to Min Clients." : " "}
          />

          <TextField
            label="Payout Amount (₹)"
            value={form.payoutAmount}
            onChange={(e) => setField("payoutAmount", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            inputMode="numeric"
            placeholder="7500"
          />

          <TextField
            label="Base Rate per Client (₹)"
            value={form.baseRatePerClient}
            onChange={(e) => setField("baseRatePerClient", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            inputMode="numeric"
            placeholder="750"
          />

          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="slab-status-label">Status</InputLabel>
            <Select
              labelId="slab-status-label"
              label="Status"
              value={form.status}
              onChange={(e) => setField("status", e.target.value as SlabDialogState["status"])}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <CtaButton variant="outlined" onClick={onClose}>
          Cancel
        </CtaButton>
        <CtaButton variant="role" onClick={handleSave} disabled={!canSave}>
          {mode === "add" ? "Save Slab" : "Update Slab"}
        </CtaButton>
      </DialogActions>
    </Dialog>
  );
}

