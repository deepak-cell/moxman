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
import { partnerOptions, policyOptions } from "@/features/admin/clients/data/mockClients";

export type ClientFormData = {
  id?: string;
  clientId: string;
  fullName: string;
  phoneNumber: string;
  emailId: string;
  branchId: string;
  partnerName: string;
  policyName: string;
  status: "Pending" | "Active" | "Closed";
};

type ClientDialogProps = {
  open: boolean;
  mode: "add" | "edit";
  initialData?: Partial<ClientFormData>;
  onClose: () => void;
  onSave: (data: ClientFormData) => void;
};

const emptyForm: ClientFormData = {
  clientId: "",
  fullName: "",
  phoneNumber: "",
  emailId: "",
  branchId: "",
  partnerName: "",
  policyName: "",
  status: "Pending",
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

export default function ClientDialog({
  open,
  mode,
  initialData,
  onClose,
  onSave,
}: ClientDialogProps) {
  const mergedInitial = useMemo(
    () => ({ ...emptyForm, ...initialData }) as ClientFormData,
    [initialData],
  );
  const [form, setForm] = useState<ClientFormData>(mergedInitial);

  const setField = <K extends keyof ClientFormData>(key: K, value: ClientFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canSave =
    form.clientId.trim() !== "" &&
    form.fullName.trim() !== "" &&
    form.phoneNumber.trim() !== "" &&
    form.branchId.trim() !== "" &&
    form.partnerName.trim() !== "" &&
    form.policyName.trim() !== "" &&
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
        {mode === "add" ? "Add Client" : "Edit Client"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography sx={sectionTitleSx}>Client Details</Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Client ID"
            value={form.clientId}
            onChange={(e) => setField("clientId", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            placeholder="CL-1005"
            disabled={mode === "edit"}
          />

          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="client-status-label">Status</InputLabel>
            <Select
              labelId="client-status-label"
              label="Status"
              value={form.status}
              onChange={(e) => setField("status", e.target.value as ClientFormData["status"])}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Full Name"
            value={form.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            fullWidth
            required
            sx={{ ...fieldSx, gridColumn: { sm: "1 / -1" } }}
            placeholder="Enter client name"
          />

          <TextField
            label="Phone Number"
            value={form.phoneNumber}
            onChange={(e) => setField("phoneNumber", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            inputMode="numeric"
            placeholder="Enter phone number"
          />

          <TextField
            label="Email (optional)"
            value={form.emailId}
            onChange={(e) => setField("emailId", e.target.value)}
            fullWidth
            sx={fieldSx}
            placeholder="name@example.com"
          />

          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="client-branch-label">Branch</InputLabel>
            <Select
              labelId="client-branch-label"
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
            <InputLabel id="client-partner-label">Partner</InputLabel>
            <Select
              labelId="client-partner-label"
              label="Partner"
              value={form.partnerName}
              onChange={(e) => setField("partnerName", String(e.target.value))}
            >
              {partnerOptions.map((option) => (
                <MenuItem key={option.id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="client-policy-label">Policy</InputLabel>
            <Select
              labelId="client-policy-label"
              label="Policy"
              value={form.policyName}
              onChange={(e) => setField("policyName", String(e.target.value))}
            >
              {policyOptions.map((option) => (
                <MenuItem key={option.id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <CtaButton variant="outlined" onClick={onClose}>
          Cancel
        </CtaButton>
        <CtaButton variant="role" onClick={() => onSave(form)} disabled={!canSave}>
          {mode === "add" ? "Save Client" : "Update Client"}
        </CtaButton>
      </DialogActions>
    </Dialog>
  );
}

