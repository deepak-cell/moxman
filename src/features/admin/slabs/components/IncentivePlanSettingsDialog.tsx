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
  Alert,
} from "@mui/material";
import { useMemo, useState } from "react";
import CtaButton from "@/components/ui/CtaButton";
import {
  deriveMinCommissionPercent,
  IncentivePlanSettingsFormData,
} from "@/features/admin/slabs/data/mockIncentivePlanSettings";

type IncentivePlanSettingsDialogProps = {
  open: boolean;
  mode: "add" | "edit";
  initialData?: Partial<IncentivePlanSettingsFormData>;
  onClose: () => void;
  onSave: (data: IncentivePlanSettingsFormData) => void;
};

type DialogState = {
  basePayPerClient: string;
  incentiveBasePerClient: string;
  over200ClientsThreshold: string;
  over200ClientsPercent: string;
  status: "Active" | "Inactive";
};

const emptyForm: DialogState = {
  basePayPerClient: "",
  incentiveBasePerClient: "",
  over200ClientsThreshold: "",
  over200ClientsPercent: "",
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

function toInitialState(data?: Partial<IncentivePlanSettingsFormData>): DialogState {
  return {
    basePayPerClient: data?.basePayPerClient != null ? String(data.basePayPerClient) : emptyForm.basePayPerClient,
    incentiveBasePerClient: data?.incentiveBasePerClient != null ? String(data.incentiveBasePerClient) : emptyForm.incentiveBasePerClient,
    over200ClientsThreshold: data?.over200ClientsThreshold != null ? String(data.over200ClientsThreshold) : emptyForm.over200ClientsThreshold,
    over200ClientsPercent: data?.over200ClientsPercent != null ? String(data.over200ClientsPercent) : emptyForm.over200ClientsPercent,
    status: data?.isActive === false ? "Inactive" : "Active",
  };
}

function parsePositiveNumber(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed > 0 ? parsed : null;
}

function parsePositiveInt(value: string): number | null {
  const num = parsePositiveNumber(value);
  if (num == null) return null;
  const int = Math.floor(num);
  return int > 0 ? int : null;
}

export default function IncentivePlanSettingsDialog({
  open,
  mode,
  initialData,
  onClose,
  onSave,
}: IncentivePlanSettingsDialogProps) {
  const mergedInitial = useMemo(() => toInitialState(initialData), [initialData]);
  const [form, setForm] = useState<DialogState>(mergedInitial);

  const setField = <K extends keyof DialogState>(key: K, value: DialogState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // --- parsed values ---
  const basePayPerClient = parsePositiveNumber(form.basePayPerClient);
  const incentiveBasePerClient = parsePositiveNumber(form.incentiveBasePerClient);
  const over200ClientsThreshold = parsePositiveInt(form.over200ClientsThreshold);
  const over200ClientsPercent = parsePositiveNumber(form.over200ClientsPercent);

  // --- derived ---
  const minCommissionPercent =
    basePayPerClient != null && incentiveBasePerClient != null
      ? deriveMinCommissionPercent({ basePayPerClient, incentiveBasePerClient })
      : null;

  // --- validations ---
  const isIncentiveBaseValid =
    incentiveBasePerClient == null ||
    basePayPerClient == null ||
    incentiveBasePerClient > basePayPerClient;

  const isHighVolPercentValid =
    over200ClientsPercent == null ||
    minCommissionPercent == null ||
    (over200ClientsPercent > minCommissionPercent && over200ClientsPercent <= 100);

  const canSave =
    basePayPerClient != null &&
    incentiveBasePerClient != null &&
    over200ClientsThreshold != null &&
    over200ClientsPercent != null &&
    isIncentiveBaseValid &&
    isHighVolPercentValid;

  const handleSave = () => {
    if (
      !canSave ||
      basePayPerClient == null ||
      incentiveBasePerClient == null ||
      over200ClientsThreshold == null ||
      over200ClientsPercent == null
    )
      return;

    onSave({
      id: initialData?.id,
      basePayPerClient,
      incentiveBasePerClient,
      over200ClientsThreshold,
      over200ClientsPercent,
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
        {mode === "add" ? "Add Incentive Plan" : "Edit Incentive Plan"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>

        {/* Section 1 — Pay Structure */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={sectionTitleSx}>Pay Structure</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Defines the per-client payout formula. Base pay is the guaranteed floor; the incentive
            base is the gross pool the commission % is applied against.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            label="Base Pay per Client (₹)"
            value={form.basePayPerClient}
            onChange={(e) => setField("basePayPerClient", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            inputMode="numeric"
            placeholder="750"
            error={basePayPerClient != null && basePayPerClient <= 0}
            helperText={
              basePayPerClient != null && basePayPerClient <= 0
                ? "Must be greater than 0."
                : " "
            }
          />

          <TextField
            label="Incentive Base per Client (₹)"
            value={form.incentiveBasePerClient}
            onChange={(e) => setField("incentiveBasePerClient", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            inputMode="numeric"
            placeholder="5000"
            error={!isIncentiveBaseValid && form.incentiveBasePerClient.trim() !== ""}
            helperText={
              !isIncentiveBaseValid && form.incentiveBasePerClient.trim() !== ""
                ? "Incentive base must be greater than base pay."
                : minCommissionPercent != null
                  ? `Min commission % across all tiers will be ${minCommissionPercent.toFixed(1)}%.`
                  : " "
            }
          />
        </Box>

        {/* Section 2 — High Volume Rule */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={sectionTitleSx}>High Volume Rule</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Partners exceeding the threshold get a fixed commission %, overriding any tier match.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            label="High Volume Threshold (clients)"
            value={form.over200ClientsThreshold}
            onChange={(e) => setField("over200ClientsThreshold", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            inputMode="numeric"
            placeholder="200"
            helperText="Partners above this count use the fixed rate below."
          />

          <TextField
            label="High Volume Commission %"
            value={form.over200ClientsPercent}
            onChange={(e) => setField("over200ClientsPercent", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            inputMode="numeric"
            placeholder="40"
            error={!isHighVolPercentValid && form.over200ClientsPercent.trim() !== ""}
            helperText={
              !isHighVolPercentValid && form.over200ClientsPercent.trim() !== ""
                ? `Must be between ${minCommissionPercent?.toFixed(1) ?? "—"}% and 100%.`
                : " "
            }
          />
        </Box>

        {/* Section 3 — Status */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={sectionTitleSx}>Plan Status</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Only one plan should be active at a time.
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="plan-status-label">Status</InputLabel>
            <Select
              labelId="plan-status-label"
              label="Status"
              value={form.status}
              onChange={(e) => setField("status", e.target.value as DialogState["status"])}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Live preview */}
        {minCommissionPercent != null && (
          <Alert severity="info" sx={{ mt: 3, borderRadius: "0.5rem" }}>
            With these settings, the minimum tier commission is{" "}
            <strong>{minCommissionPercent.toFixed(2)}%</strong>. Any tier below this would result in
            a negative incentive payout and will be rejected by the slab form.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <CtaButton variant="outlined" onClick={onClose}>
          Cancel
        </CtaButton>
        <CtaButton variant="role" onClick={handleSave} disabled={!canSave}>
          {mode === "add" ? "Save Plan" : "Update Plan"}
        </CtaButton>
      </DialogActions>
    </Dialog>
  );
}
