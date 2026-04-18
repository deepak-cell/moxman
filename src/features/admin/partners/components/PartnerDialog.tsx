"use client";

import {
  Box,
  Checkbox,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Button,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import DrawIcon from "@mui/icons-material/Draw";
import { useMemo, useRef, useState } from "react";
import CtaButton from "@/components/ui/CtaButton";
import DatePickerField from "@/components/ui/DatePickerField";
import {
  branchManagerOptions,
  branchOptions,
  relationshipManagerOptions,
} from "@/features/admin/partners/data/mockPartnerOptions";

export type PartnerFormData = {
  id?: string;
  // Profile
  profilePhoto: File | null;
  profilePhotoPreview: string;

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
  addressProofFile: File | null;

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
  bankProofPreview: string;

  // Declaration
  declarationAccepted: boolean;
  place: string;
  signatureFile: File | null;
  signaturePreview: string;

  // For Office Purpose Only
  branchId: string;
  relationshipManagerId: string;
  branchManagerId: string;
};

type PartnerDialogProps = {
  open: boolean;
  mode: "add" | "edit";
  initialData?: Partial<PartnerFormData>;
  onClose: () => void;
  onSave: (data: PartnerFormData) => void;
};

const emptyForm: PartnerFormData = {
  profilePhoto: null,
  profilePhotoPreview: "",

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
  addressProofFile: null,

  previouslyWorkedAsAgentOrPosp: "",
  previouslyWorkedInsuranceCompanyName: "",

  bankName: "",
  bankBranch: "",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  bankProofFile: null,
  bankProofPreview: "",

  declarationAccepted: false,
  place: "",
  signatureFile: null,
  signaturePreview: "",

  branchId: "",
  relationshipManagerId: "",
  branchManagerId: "",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.5rem",
    height: 48,
  },
  // Override MUI's default padding on the inner <input> so the root stays at 48px.
  // DatePicker passes sx to slotProps.textField which targets this same element.
  "& .MuiOutlinedInput-input": {
    paddingTop: "13px",
    paddingBottom: "13px",
  },
  "& .MuiInputLabel-outlined": {
    transform: "translate(14px, 13px) scale(1)",
  },
  "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
    transform: "translate(14px, -9px) scale(0.75)",
  },
};

const textAreaFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.5rem",
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

// Reusable upload button + inline image/pdf preview block
// Shows: upload button → after upload: thumbnail (image) or generic icon (pdf) inline
function UploadPreviewBlock({
  label,
  icon,
  accept,
  previewSrc,
  isPdf,
  inputRef,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  accept: string;
  previewSrc: string;
  isPdf?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={onChange}
      />
      <Button
        variant="outlined"
        size="small"
        startIcon={icon}
        onClick={() => inputRef.current?.click()}
        sx={{
          borderRadius: "0.5rem",
          textTransform: "none",
          height: 48,
          fontSize: "0.875rem",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {label}
      </Button>

      {previewSrc && (
        isPdf ? (
          // PDF: show a small icon tile instead of image
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.5,
              py: 0.75,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "0.5rem",
              bgcolor: "background.paper",
              cursor: "pointer",
            }}
            onClick={() => window.open(previewSrc, "_blank")}
            title="Preview PDF"
          >
            <CloudUploadIcon sx={{ fontSize: 20, color: "error.main" }} />
            <Typography variant="caption" color="text.secondary">
              PDF uploaded
            </Typography>
          </Box>
        ) : (
          // Image: inline thumbnail, click to full size
          <Box
            component="img"
            src={previewSrc}
            alt={`${label} preview`}
            onClick={() => window.open(previewSrc, "_blank")}
            sx={{
              height: 48,
              maxWidth: 120,
              objectFit: "contain",
              borderRadius: "0.5rem",
              border: "1px solid",
              borderColor: "divider",
              cursor: "pointer",
              bgcolor: "background.paper",
              p: 0.25,
            }}
            title="Click to preview"
          />
        )
      )}
    </Box>
  );
}

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
  const profileInputRef = useRef<HTMLInputElement>(null);
  const addressProofInputRef = useRef<HTMLInputElement>(null);
  const bankProofInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof PartnerFormData>(
    key: K,
    value: PartnerFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const showPreviousCompany = form.previouslyWorkedAsAgentOrPosp === "Yes";

  const handleProfileClick = () => profileInputRef.current?.click();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0) ?? null;
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, profilePhoto: file, profilePhotoPreview: url }));
    }
  };

  const handleAddressProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setField("addressProofFile", e.target.files?.item(0) ?? null);
  };

  const handlePreviewAddressProof = () => {
    if (form.addressProofFile) {
      window.open(URL.createObjectURL(form.addressProofFile), "_blank");
    }
  };

  const handleBankProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0) ?? null;
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((prev) => ({
        ...prev,
        bankProofFile: file,
        bankProofPreview: url,
      }));
    }
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0) ?? null;
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, signatureFile: file, signaturePreview: url }));
    }
  };

  const addressProofLabel = form.addressProofType
    ? `Upload ${form.addressProofType}`
    : "Upload Address Proof";

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
    form.declarationAccepted &&
    form.place.trim() !== "" &&
    form.branchId.trim() !== "" &&
    form.relationshipManagerId.trim() !== "" &&
    form.branchManagerId.trim() !== "";

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
          {/* ── Profile Preview ── */}
          <Box
            sx={{
              gridColumn: "1 / -1",
              display: "flex",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <Box
              onClick={handleProfileClick}
              sx={{
                position: "relative",
                width: 100,
                height: 100,
                cursor: "pointer",
                borderRadius: "50%",
                "&:hover .edit-overlay": { opacity: 1 },
              }}
            >
              <Avatar
                src={form.profilePhotoPreview || undefined}
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "grey.200",
                  border: "2px solid",
                  borderColor: "divider",
                }}
              >
                {!form.profilePhotoPreview && (
                  <PersonIcon sx={{ fontSize: 52, color: "grey.500" }} />
                )}
              </Avatar>
              <Box
                className="edit-overlay"
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  bgcolor: "rgba(0,0,0,0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
              >
                <EditIcon sx={{ color: "#fff", fontSize: 28 }} />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  bgcolor: "primary.main",
                  borderRadius: "50%",
                  width: 26,
                  height: 26,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: 2,
                }}
              >
                <EditIcon sx={{ color: "#fff", fontSize: 14 }} />
              </Box>
            </Box>
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleProfileChange}
            />
          </Box>

          {/* ── Personal Information ── */}
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
            label="Father's / Husband's Name"
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
              onChange={(e) =>
                setField("gender", e.target.value as PartnerFormData["gender"])
              }
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          {/* ── Contact Details ── */}
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
          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              label="Communication Address"
              value={form.communicationAddress}
              onChange={(e) => setField("communicationAddress", e.target.value)}
              fullWidth
              required
              multiline
              minRows={3}
              sx={textAreaFieldSx}
            />
          </Box>

          {/* ── KYC Details ── */}
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
            <InputLabel id="address-proof-type-label">Address Proof Type</InputLabel>
            <Select
              labelId="address-proof-type-label"
              label="Address Proof Type"
              value={form.addressProofType}
              onChange={(e) => {
                setField("addressProofType", e.target.value as PartnerFormData["addressProofType"]);
                setField("addressProofFile", null);
                setField("addressProofNumber", "");
              }}
            >
              <MenuItem value="Aadhaar">Aadhaar</MenuItem>
              <MenuItem value="Voter ID">Voter ID</MenuItem>
              <MenuItem value="Driving License">Driving License</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={form.addressProofType ? `${form.addressProofType} Number` : "Address Proof Number"}
            value={form.addressProofNumber}
            onChange={(e) => setField("addressProofNumber", e.target.value)}
            fullWidth
            required
            disabled={!form.addressProofType}
            sx={fieldSx}
          />
          {form.addressProofType && (
            <Box
              sx={{
                gridColumn: "1 / -1",
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: "0.5rem",
                bgcolor: "action.hover",
              }}
            >
              <input
                ref={addressProofInputRef}
                type="file"
                accept="image/*,application/pdf"
                hidden
                onChange={handleAddressProofFileChange}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<CloudUploadIcon />}
                onClick={() => addressProofInputRef.current?.click()}
                sx={{ borderRadius: "0.5rem", textTransform: "none", whiteSpace: "nowrap" }}
              >
                {addressProofLabel}
              </Button>
              {form.addressProofFile ? (
                <>
                  <Chip
                    label={form.addressProofFile.name}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ maxWidth: 220, overflow: "hidden" }}
                  />
                  <IconButton size="small" title="Preview document" onClick={handlePreviewAddressProof}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  Upload {form.addressProofType} document (Image / PDF)
                </Typography>
              )}
            </Box>
          )}

          {/* ── Insurance Regulatory Details ── */}
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
                const value = e.target.value as PartnerFormData["previouslyWorkedAsAgentOrPosp"];
                setField("previouslyWorkedAsAgentOrPosp", value);
                if (value !== "Yes") setField("previouslyWorkedInsuranceCompanyName", "");
              }}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Previously worked Insurance Company Name"
            value={form.previouslyWorkedInsuranceCompanyName}
            onChange={(e) => setField("previouslyWorkedInsuranceCompanyName", e.target.value)}
            fullWidth
            sx={fieldSx}
            disabled={!showPreviousCompany}
          />

          {/* ── Banking Details ── */}
          <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Typography sx={sectionTitleSx}>Banking Details (For Commission Payment)</Typography>
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

          {/* Bank Proof Upload — same UI as signature */}
          <UploadPreviewBlock
            label="Upload Bank Proof"
            icon={<CloudUploadIcon />}
            accept="image/*,application/pdf"
            previewSrc={form.bankProofPreview}
            isPdf={form.bankProofFile?.type === "application/pdf"}
            inputRef={bankProofInputRef}
            onChange={handleBankProofChange}
          />

          {/* ── For Office Purpose Only ── */}
          <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Typography sx={sectionTitleSx}>For Office Purpose Only</Typography>
          </Box>
          <FormControl fullWidth sx={{ ...fieldSx, gridColumn: "1 / -1" }} required>
            <InputLabel id="branch-label">Branch</InputLabel>
            <Select
              labelId="branch-label"
              label="Branch"
              value={form.branchId}
              onChange={(e) => {
                const branchId = e.target.value as string;
                setForm((prev) => ({
                  ...prev,
                  branchId,
                  branchManagerId: "",
                  relationshipManagerId: "",
                }));
              }}
            >
              {branchOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            sx={{ ...fieldSx, gridColumn: "1 / -1" }}
            required
            disabled={!form.branchId.trim()}
          >
            <InputLabel id="bm-label">Branch Manager</InputLabel>
            <Select
              labelId="bm-label"
              label="Branch Manager"
              value={form.branchManagerId}
              onChange={(e) => {
                const branchManagerId = e.target.value as string;
                setForm((prev) => ({
                  ...prev,
                  branchManagerId,
                  relationshipManagerId: "",
                }));
              }}
            >
              {branchManagerOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            sx={{ ...fieldSx, gridColumn: "1 / -1" }}
            required
            disabled={!form.branchManagerId.trim()}
          >
            <InputLabel id="rm-label">Relationship Manager</InputLabel>
            <Select
              labelId="rm-label"
              label="Relationship Manager"
              value={form.relationshipManagerId}
              onChange={(e) =>
                setField("relationshipManagerId", e.target.value as string)
              }
            >
              {relationshipManagerOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ── Declaration ── */}
          <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Typography sx={sectionTitleSx}>Declaration</Typography>
          </Box>

          {/* Place — left column */}
          <TextField
            label="Place"
            value={form.place}
            onChange={(e) => setField("place", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />

          {/* Signature Upload — right column, same UI as Bank Proof */}
          <UploadPreviewBlock
            label="Upload Signature"
            icon={<DrawIcon />}
            accept="image/*"
            previewSrc={form.signaturePreview}
            isPdf={false}
            inputRef={signatureInputRef}
            onChange={handleSignatureChange}
          />

          {/* Declaration checkbox — full width */}
          <Box
            sx={{
              gridColumn: "1 / -1",
              p: 2,
              border: "1px solid",
              borderColor: form.declarationAccepted ? "primary.main" : "divider",
              borderRadius: "0.5rem",
              bgcolor: form.declarationAccepted ? "primary.50" : "action.hover",
              transition: "border-color 0.2s, background-color 0.2s",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.declarationAccepted}
                  onChange={(e) => setField("declarationAccepted", e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  I hereby declare that the information provided in this form is true and correct
                  to the best of my knowledge. I agree to comply with the rules and regulations
                  of IRDAI and Moxman Fintech for insurance distribution.
                </Typography>
              }
              sx={{ alignItems: "flex-start", m: 0 }}
            />
          </Box>
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
