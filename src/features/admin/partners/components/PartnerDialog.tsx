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
} from "@mui/material";
import CtaButton from "@/components/ui/CtaButton";
import {
  branchManagerOptions,
  branchOptions,
  relationshipManagerOptions,
  statusOptions,
} from "@/features/admin/partners/data/mockPartnerOptions";

export type PartnerFormData = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  pan: string;
  gst: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  branchId: string;
  relationshipManagerId: string;
  branchManagerId: string;
  status: string;
};

type PartnerDialogProps = {
  open: boolean;
  mode: "add" | "edit";
  initialData?: Partial<PartnerFormData>;
  onClose: () => void;
  onSave: (data: PartnerFormData) => void;
};

const emptyForm: PartnerFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  pan: "",
  gst: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  branchId: "",
  relationshipManagerId: "",
  branchManagerId: "",
  status: "Active",
};

// Shared sx for every field — uniform height, no manual padding fights
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.5rem",
    height: 48,
  },
  // Let MUI own all label transforms; just ensure the notch cuts through cleanly
  "& .MuiInputLabel-outlined": {
    // vertically centred inside the 48px input when not shrunk
    transform: "translate(14px, 13px) scale(1)",
  },
  "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
    // standard shrink — sits on top border, fully visible
    transform: "translate(14px, -9px) scale(0.75)",
  },
};

export default function PartnerDialog({
  open,
  mode,
  initialData,
  onClose,
  onSave,
}: PartnerDialogProps) {
  const form = { ...emptyForm, ...initialData } as PartnerFormData;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{pb:0}}>
        {mode === "add" ? "Add Partner" : "Edit Partner"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Partner Name"
            defaultValue={form.name}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Company"
            defaultValue={form.company}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Email"
            defaultValue={form.email}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Phone"
            defaultValue={form.phone}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="PAN"
            defaultValue={form.pan}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="GST"
            defaultValue={form.gst}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Address"
            defaultValue={form.address}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="City"
            defaultValue={form.city}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="State"
            defaultValue={form.state}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Pincode"
            defaultValue={form.pincode}
            fullWidth
            sx={fieldSx}
          />

          <FormControl fullWidth sx={fieldSx}>
            <InputLabel id="branch-label">Branch</InputLabel>
            <Select
              labelId="branch-label"
              label="Branch"
              defaultValue={form.branchId}
            >
              {branchOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={fieldSx}>
            <InputLabel id="rm-label">Relationship Manager</InputLabel>
            <Select
              labelId="rm-label"
              label="Relationship Manager"
              defaultValue={form.relationshipManagerId}
            >
              {relationshipManagerOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={fieldSx}>
            <InputLabel id="bm-label">Branch Manager</InputLabel>
            <Select
              labelId="bm-label"
              label="Branch Manager"
              defaultValue={form.branchManagerId}
            >
              {branchManagerOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={fieldSx}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              defaultValue={form.status}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
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
        <CtaButton variant="role" onClick={() => onSave(form)}>
          {mode === "add" ? "Save Partner" : "Update Partner"}
        </CtaButton>
      </DialogActions>
    </Dialog>
  );
}
