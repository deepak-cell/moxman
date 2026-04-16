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

export type BranchFormData = {
  id?: string;
  branchCode: string;
  branchName: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  status: "Active" | "Inactive";
};

type BranchDialogProps = {
  open: boolean;
  mode: "add" | "edit";
  initialData?: Partial<BranchFormData>;
  onClose: () => void;
  onSave: (data: BranchFormData) => void;
};

const emptyForm: BranchFormData = {
  branchCode: "",
  branchName: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
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

export default function BranchDialog({
  open,
  mode,
  initialData,
  onClose,
  onSave,
}: BranchDialogProps) {
  const mergedInitial = useMemo(
    () => ({ ...emptyForm, ...initialData }) as BranchFormData,
    [initialData],
  );
  const [form, setForm] = useState<BranchFormData>(mergedInitial);

  const setField = <K extends keyof BranchFormData>(key: K, value: BranchFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canSave =
    form.branchCode.trim() !== "" &&
    form.branchName.trim() !== "" &&
    form.city.trim() !== "" &&
    form.state.trim() !== "" &&
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
        {mode === "add" ? "Add Branch" : "Edit Branch"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography sx={sectionTitleSx}>Branch Details</Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Branch Code"
            value={form.branchCode}
            onChange={(e) => setField("branchCode", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            placeholder="BR-05"
            disabled={mode === "edit"}
          />

          <TextField
            label="Branch Name"
            value={form.branchName}
            onChange={(e) => setField("branchName", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            placeholder="Enter branch name"
          />

          <TextField
            label="City"
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            placeholder="Enter city"
          />

          <TextField
            label="State"
            value={form.state}
            onChange={(e) => setField("state", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            placeholder="Enter state"
          />

          <TextField
            label="Address"
            value={form.addressLine}
            onChange={(e) => setField("addressLine", e.target.value)}
            fullWidth
            sx={{ ...fieldSx, gridColumn: { sm: "1 / -1" } }}
            placeholder="Enter address"
          />

          <TextField
            label="Pincode"
            value={form.pincode}
            onChange={(e) => setField("pincode", e.target.value)}
            fullWidth
            sx={fieldSx}
            inputMode="numeric"
            placeholder="Enter pincode"
          />

          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="branch-status-label">Status</InputLabel>
            <Select
              labelId="branch-status-label"
              label="Status"
              value={form.status}
              onChange={(e) => setField("status", e.target.value as BranchFormData["status"])}
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
        <CtaButton variant="role" onClick={() => onSave(form)} disabled={!canSave}>
          {mode === "add" ? "Save Branch" : "Update Branch"}
        </CtaButton>
      </DialogActions>
    </Dialog>
  );
}

