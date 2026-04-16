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
import { incentivePlanDefaults } from "@/features/admin/slabs/data/mockSlabs";

export type SlabFormData = {
  id?: string;
  name: string;
  minClients: number;
  maxClients: number | null; // exclusive upper bound
  commissionPercent: number;
  isActive: boolean;
};

type SlabDialogProps = {
  open: boolean;
  mode: "add" | "edit";
  initialData?: Partial<SlabFormData>;
  actorRole?: string | null;
  onClose: () => void;
  onSave: (data: SlabFormData) => void;
};

type SlabDialogState = {
  name: string;
  minClients: string;
  maxClientsInclusive: string; // empty = no cap
  commissionPercent: string;
  status: "Active" | "Inactive";
};

const emptyForm: SlabDialogState = {
  name: "",
  minClients: "",
  maxClientsInclusive: "",
  commissionPercent: String(
    (incentivePlanDefaults.basePayPerClient / incentivePlanDefaults.incentiveBasePerClient) * 100
  ),
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
    commissionPercent:
      data?.commissionPercent != null ? String(data.commissionPercent) : emptyForm.commissionPercent,
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
  actorRole,
  onClose,
  onSave,
}: SlabDialogProps) {
  const mergedInitial = useMemo(() => toInitialState(initialData), [initialData]);
  const [form, setForm] = useState<SlabDialogState>(mergedInitial);

  const setField = <K extends keyof SlabDialogState>(key: K, value: SlabDialogState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const minClients = parsePositiveInt(form.minClients);
  const maxClientsInclusive = parseNonNegativeInt(form.maxClientsInclusive);
  const commissionPercent = parseNonNegativeNumber(form.commissionPercent);

  const isMaxValid =
    maxClientsInclusive == null || (minClients != null && maxClientsInclusive >= minClients);

  const minPercentToCoverBase =
    (incentivePlanDefaults.basePayPerClient / incentivePlanDefaults.incentiveBasePerClient) * 100;
  const isPercentValid =
    commissionPercent != null && commissionPercent >= minPercentToCoverBase && commissionPercent <= 100;

  const isOver200Tier =
    (minClients ?? initialData?.minClients ?? 0) > incentivePlanDefaults.over200ClientsThreshold;

  const canSave =
    form.name.trim() !== "" &&
    minClients != null &&
    commissionPercent != null &&
    isMaxValid &&
    isPercentValid;

  const handleSave = () => {
    if (!canSave || minClients == null || commissionPercent == null) return;
    const maxExclusive =
      form.maxClientsInclusive.trim() === "" ? null : (maxClientsInclusive ?? minClients) + 1;

    const normalizedPercent = isOver200Tier
      ? incentivePlanDefaults.over200ClientsPercent
      : commissionPercent;

    onSave({
      id: initialData?.id,
      name: form.name.trim(),
      minClients,
      maxClients: maxExclusive,
      commissionPercent: normalizedPercent,
      isActive: form.status === "Active",
    });
  };

  const canEditPercent = actorRole === "ADMIN" && !isOver200Tier;

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
        {mode === "add" ? "Add Tier" : "Edit Tier"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography sx={sectionTitleSx}>Tier Info</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Base pay is fixed at ₹{incentivePlanDefaults.basePayPerClient}/client. Incentives are calculated from
            the commission percent.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Tier Name"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            fullWidth
            required
            sx={{ ...fieldSx, gridColumn: { sm: "1 / -1" } }}
            placeholder="Starter"
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
            label="Commission %"
            value={isOver200Tier ? String(incentivePlanDefaults.over200ClientsPercent) : form.commissionPercent}
            onChange={(e) => setField("commissionPercent", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            inputMode="numeric"
            placeholder="20"
            disabled={!canEditPercent}
            error={!isPercentValid && form.commissionPercent.trim() !== "" && !isOver200Tier}
            helperText={
              isOver200Tier
                ? `For more than ${incentivePlanDefaults.over200ClientsThreshold} clients, commission is fixed at ${incentivePlanDefaults.over200ClientsPercent}%.`
                : !canEditPercent
                  ? "Only Admin can edit Commission %."
                  : !isPercentValid && form.commissionPercent.trim() !== ""
                    ? `Commission % must be between ${minPercentToCoverBase.toFixed(0)} and 100.`
                    : " "
            }
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
          {mode === "add" ? "Save Tier" : "Update Tier"}
        </CtaButton>
      </DialogActions>
    </Dialog>
  );
}
