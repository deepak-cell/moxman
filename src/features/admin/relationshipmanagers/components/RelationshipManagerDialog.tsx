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
import { branchOptions } from "@/features/admin/partners/data/mockPartnerOptions";

export type RelationshipManagerFormData = {
  id?: string;
  fullName: string;
  emailId: string;
  phoneNumber: string;
  branchId: string;
  status: "Active" | "Inactive";
};

type RelationshipManagerDialogProps = {
  open: boolean;
  mode: "add" | "edit";
  initialData?: Partial<RelationshipManagerFormData>;
  onClose: () => void;
  onSave: (data: RelationshipManagerFormData) => void;
};

const emptyForm: RelationshipManagerFormData = {
  fullName: "",
  emailId: "",
  phoneNumber: "",
  branchId: "",
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

export default function RelationshipManagerDialog({
  open,
  mode,
  initialData,
  onClose,
  onSave,
}: RelationshipManagerDialogProps) {
  const mergedInitial = useMemo(
    () => ({ ...emptyForm, ...initialData }) as RelationshipManagerFormData,
    [initialData],
  );
  const [form, setForm] = useState<RelationshipManagerFormData>(mergedInitial);

  const setField = <K extends keyof RelationshipManagerFormData>(
    key: K,
    value: RelationshipManagerFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const canSave =
    form.fullName.trim() !== "" &&
    form.emailId.trim() !== "" &&
    (mode === "edit" || form.phoneNumber.trim() !== "") &&
    form.branchId.trim() !== "" &&
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
        {mode === "add" ? "Add Relationship Manager" : "Edit Relationship Manager"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography sx={sectionTitleSx}>Relationship Manager Details</Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {/* Full Name — spans both columns */}
          <TextField
            label="Full Name"
            value={form.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            fullWidth
            required
            sx={{ ...fieldSx, gridColumn: { sm: "1 / -1" } }}
            placeholder="Enter full name"
          />

          {/* Email and Phone in the same row */}
          <TextField
            label="Email"
            value={form.emailId}
            onChange={(e) => setField("emailId", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            placeholder="Enter email"
          />
          <TextField
            label="Phone Number"
            value={form.phoneNumber}
            onChange={(e) => setField("phoneNumber", e.target.value)}
            fullWidth
            required={mode === "add"}
            sx={fieldSx}
            inputMode="numeric"
            placeholder={mode === "add" ? "Enter phone number" : "—"}
          />

          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="rm-branch-label">Branch</InputLabel>
            <Select
              labelId="rm-branch-label"
              label="Branch"
              value={form.branchId}
              onChange={(e) => setField("branchId", String(e.target.value))}
            >
              {branchOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="rm-status-label">Status</InputLabel>
            <Select
              labelId="rm-status-label"
              label="Status"
              value={form.status}
              onChange={(e) =>
                setField("status", e.target.value as RelationshipManagerFormData["status"])
              }
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
          {mode === "add" ? "Save Relationship Manager" : "Update Relationship Manager"}
        </CtaButton>
      </DialogActions>
    </Dialog>
  );
}