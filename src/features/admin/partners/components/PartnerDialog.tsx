"use client";

import {
  Box,
  Divider,
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
import DatePickerField from "@/components/ui/DatePickerField";
import {
  branchManagerOptions,
  branchOptions,
  relationshipManagerOptions,
} from "@/features/admin/partners/data/mockPartnerOptions";

export type PartnerFormData = {
  id?: string;
  // 1. Personal Information
  fullName: string;
  fatherOrHusbandName: string;
  dateOfBirth: string;
  gender: "" | "Male" | "Female" | "Other";

  // 2. Contact Details
  mobileNumber: string;
  alternateMobileNumber: string;
  emailId: string;
  communicationAddress: string;

  // 3. KYC Details
  aadhaarNumber: string;
  panNumber: string;
  addressProofType: "" | "Aadhaar" | "Voter ID" | "Driving License";
  addressProofNumber: string;

  // 4. Insurance Regulatory Details
  previouslyWorkedAsAgentOrPosp: "" | "Yes" | "No";
  previouslyWorkedInsuranceCompanyName: string;

  // 5. Banking Details (For Commission Payment)
  bankName: string;
  bankBranch: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankProofFile: File | null;

  // 8. Declaration
  applicantSignature: string;
  declarationDate: string;
  place: string;

  // For Office Purpose Only
  branchId: string;
  relationshipManagerId: string;
  branchManagerId: string;
  appointedDate: string;
};

type PartnerDialogProps = {
  open: boolean;
  mode: "add" | "edit";
  initialData?: Partial<PartnerFormData>;
  onClose: () => void;
  onSave: (data: PartnerFormData) => void;
};

const emptyForm: PartnerFormData = {
  fullName: "",
  fatherOrHusbandName: "",
  dateOfBirth: "",
  gender: "",

  mobileNumber: "",
  alternateMobileNumber: "",
  emailId: "",
  communicationAddress: "",

  aadhaarNumber: "",
  panNumber: "",
  addressProofType: "",
  addressProofNumber: "",

  previouslyWorkedAsAgentOrPosp: "",
  previouslyWorkedInsuranceCompanyName: "",

  bankName: "",
  bankBranch: "",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  bankProofFile: null,

  applicantSignature: "",
  declarationDate: "",
  place: "",

  branchId: "",
  relationshipManagerId: "",
  branchManagerId: "",
  appointedDate: "",
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

const sectionTitleSx = {
  fontWeight: 700,
  fontSize: 14,
  letterSpacing: "0.02em",
  color: "text.primary",
};

export default function PartnerDialog({
  open,
  mode,
  initialData,
  onClose,
  onSave,
}: PartnerDialogProps) {
  const mergedInitial = useMemo(
    () => ({ ...emptyForm, ...initialData }) as PartnerFormData,
    [initialData],
  );
  const [form, setForm] = useState<PartnerFormData>(mergedInitial);

  const setField = <K extends keyof PartnerFormData>(
    key: K,
    value: PartnerFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const showPreviousCompany =
    form.previouslyWorkedAsAgentOrPosp === "Yes";

  const canSave =
    form.fullName.trim() !== "" &&
    form.fatherOrHusbandName.trim() !== "" &&
    form.dateOfBirth.trim() !== "" &&
    form.gender !== "" &&
    form.mobileNumber.trim() !== "" &&
    form.emailId.trim() !== "" &&
    form.communicationAddress.trim() !== "" &&
    form.aadhaarNumber.trim() !== "" &&
    form.panNumber.trim() !== "" &&
    form.addressProofType !== "" &&
    form.addressProofNumber.trim() !== "" &&
    form.previouslyWorkedAsAgentOrPosp !== "" &&
    (!showPreviousCompany ||
      form.previouslyWorkedInsuranceCompanyName.trim() !== "") &&
    form.bankName.trim() !== "" &&
    form.bankBranch.trim() !== "" &&
    form.accountHolderName.trim() !== "" &&
    form.accountNumber.trim() !== "" &&
    form.ifscCode.trim() !== "" &&
    form.applicantSignature.trim() !== "" &&
    form.declarationDate.trim() !== "" &&
    form.place.trim() !== "" &&
    form.branchId.trim() !== "" &&
    form.relationshipManagerId.trim() !== "" &&
    form.branchManagerId.trim() !== "" &&
    form.appointedDate.trim() !== "";

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
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography sx={sectionTitleSx}>Personal Information</Typography>
          </Box>
          <TextField
            label="Full Name (as per Aadhaar)"
            value={form.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />
          <TextField
            label="Father’s / Husband’s Name"
            value={form.fatherOrHusbandName}
            onChange={(e) => setField("fatherOrHusbandName", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />
          <DatePickerField
            label="Date of Birth"
            value={form.dateOfBirth}
            onChange={(value) => setField("dateOfBirth", value)}
            required
            sx={fieldSx}
            disableFuture
          />
          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              label="Gender"
              value={form.gender}
              onChange={(e) => setField("gender", e.target.value as PartnerFormData["gender"])}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Typography sx={sectionTitleSx}>Contact Details</Typography>
          </Box>

          <TextField
            label="Mobile Number"
            value={form.mobileNumber}
            onChange={(e) => setField("mobileNumber", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />
          <TextField
            label="Alternate Mobile Number"
            value={form.alternateMobileNumber}
            onChange={(e) => setField("alternateMobileNumber", e.target.value)}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Email ID"
            value={form.emailId}
            onChange={(e) => setField("emailId", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />
          <TextField
            label="Communication Address"
            value={form.communicationAddress}
            onChange={(e) => setField("communicationAddress", e.target.value)}
            fullWidth
            required
            multiline
            minRows={2}
            sx={fieldSx}
          />

          <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Typography sx={sectionTitleSx}>KYC Details</Typography>
          </Box>

          <TextField
            label="Aadhaar Number"
            value={form.aadhaarNumber}
            onChange={(e) => setField("aadhaarNumber", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />
          <TextField
            label="PAN Number"
            value={form.panNumber}
            onChange={(e) => setField("panNumber", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />
          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="address-proof-type-label">Address Proof</InputLabel>
            <Select
              labelId="address-proof-type-label"
              label="Address Proof"
              value={form.addressProofType}
              onChange={(e) =>
                setField(
                  "addressProofType",
                  e.target.value as PartnerFormData["addressProofType"],
                )
              }
            >
              <MenuItem value="Aadhaar">Aadhaar</MenuItem>
              <MenuItem value="Voter ID">Voter ID</MenuItem>
              <MenuItem value="Driving License">Driving License</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Address Proof Number"
            value={form.addressProofNumber}
            onChange={(e) => setField("addressProofNumber", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />

          <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Typography sx={sectionTitleSx}>Insurance Regulatory Details</Typography>
          </Box>

          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="previously-worked-label">
              Previously worked as insurance Agent / POSP?
            </InputLabel>
            <Select
              labelId="previously-worked-label"
              label="Previously worked as insurance Agent / POSP?"
              value={form.previouslyWorkedAsAgentOrPosp}
              onChange={(e) => {
                const value = e.target
                  .value as PartnerFormData["previouslyWorkedAsAgentOrPosp"];
                setField("previouslyWorkedAsAgentOrPosp", value);
                if (value !== "Yes") {
                  setField("previouslyWorkedInsuranceCompanyName", "");
                }
              }}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Previously worked as insurance Company Name"
            value={form.previouslyWorkedInsuranceCompanyName}
            onChange={(e) =>
              setField("previouslyWorkedInsuranceCompanyName", e.target.value)
            }
            fullWidth
            sx={fieldSx}
            disabled={!showPreviousCompany}
          />

          <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Typography sx={sectionTitleSx}>
              Banking Details (For Commission Payment)
            </Typography>
          </Box>

          <TextField
            label="Bank Name"
            value={form.bankName}
            onChange={(e) => setField("bankName", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />
          <TextField
            label="Branch"
            value={form.bankBranch}
            onChange={(e) => setField("bankBranch", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />
          <TextField
            label="Account Holder Name"
            value={form.accountHolderName}
            onChange={(e) => setField("accountHolderName", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />
          <TextField
            label="Account Number"
            value={form.accountNumber}
            onChange={(e) => setField("accountNumber", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />
          <TextField
            label="IFSC Code"
            value={form.ifscCode}
            onChange={(e) => setField("ifscCode", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CtaButton component="label" variant="outlined">
              Upload Bank Proof
              <input
                type="file"
                hidden
                onChange={(e) =>
                  setField(
                    "bankProofFile",
                    e.target.files?.item(0) ?? null,
                  )
                }
              />
            </CtaButton>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
              {form.bankProofFile
                ? form.bankProofFile.name
                : "Attach Cancelled cheque / Passbook Copy"}
            </Typography>
          </Box>

          <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Typography sx={sectionTitleSx}>Declaration</Typography>
          </Box>

          <TextField
            label="Applicant Signature"
            value={form.applicantSignature}
            onChange={(e) => setField("applicantSignature", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />
          <DatePickerField
            label="Date"
            value={form.declarationDate}
            onChange={(value) => setField("declarationDate", value)}
            required
            sx={fieldSx}
            disableFuture
          />
          <TextField
            label="Place"
            value={form.place}
            onChange={(e) => setField("place", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />

          <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Typography sx={sectionTitleSx}>For Office Purpose Only</Typography>
          </Box>

          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="branch-label">Branch</InputLabel>
            <Select
              labelId="branch-label"
              label="Branch"
              value={form.branchId}
              onChange={(e) => setField("branchId", e.target.value)}
            >
              {branchOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="rm-label">Relationship Manager</InputLabel>
            <Select
              labelId="rm-label"
              label="Relationship Manager"
              value={form.relationshipManagerId}
              onChange={(e) => setField("relationshipManagerId", e.target.value)}
            >
              {relationshipManagerOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={fieldSx} required>
            <InputLabel id="bm-label">Branch Manager</InputLabel>
            <Select
              labelId="bm-label"
              label="Branch Manager"
              value={form.branchManagerId}
              onChange={(e) => setField("branchManagerId", e.target.value)}
            >
              {branchManagerOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DatePickerField
            label="Appointed date"
            value={form.appointedDate}
            onChange={(value) => setField("appointedDate", value)}
            required
            sx={fieldSx}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <CtaButton variant="outlined" onClick={onClose}>
          Cancel
        </CtaButton>
        <CtaButton variant="role" onClick={() => onSave(form)} disabled={!canSave}>
          {mode === "add" ? "Save Partner" : "Update Partner"}
        </CtaButton>
      </DialogActions>
    </Dialog>
  );
}
