"use client";

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  TextField,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DrawIcon from "@mui/icons-material/Draw";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import CtaButton from "@/components/ui/CtaButton";
import DatePickerField from "@/components/ui/DatePickerField";
import UploadPreviewBlock from "@/components/ui/UploadPreviewBlock";

type PartnerRegistrationFormData = {
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
};

const emptyForm: PartnerRegistrationFormData = {
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
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.5rem",
    height: 48,
  },
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

export default function PartnerRegistrationForm() {
  const [form, setForm] = useState<PartnerRegistrationFormData>(emptyForm);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const addressProofInputRef = useRef<HTMLInputElement>(null);
  const bankProofInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof PartnerRegistrationFormData>(
    key: K,
    value: PartnerRegistrationFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const showPreviousCompany = form.previouslyWorkedAsAgentOrPosp === "Yes";

  const handleProfileClick = () => profileInputRef.current?.click();
  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0) ?? null;
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, profilePhoto: file, profilePhotoPreview: url }));
    }
  };

  const handleAddressProofFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setField("addressProofFile", e.target.files?.item(0) ?? null);
  };

  const handlePreviewAddressProof = () => {
    if (form.addressProofFile) {
      window.open(URL.createObjectURL(form.addressProofFile), "_blank");
    }
  };

  const handleBankProofChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleSignatureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0) ?? null;
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, signatureFile: file, signaturePreview: url }));
    }
  };

  const addressProofLabel = form.addressProofType
    ? `Upload ${form.addressProofType}`
    : "Upload Address Proof";

  const canSubmit = useMemo(() => {
    return (
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
      form.place.trim() !== ""
    );
  }, [form, showPreviousCompany]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: wire to API when backend is ready
    console.log("Partner registration payload:", form);
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <form onSubmit={onSubmit}>
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
                  bgcolor: "rgba(0,0,0,0.35)",
                  borderRadius: "50%",
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
                setField("gender", e.target.value as PartnerRegistrationFormData["gender"])
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
                setField("addressProofType", e.target.value as PartnerRegistrationFormData["addressProofType"]);
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
          {form.addressProofType ? (
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
          ) : null}

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
                const value = e.target.value as PartnerRegistrationFormData["previouslyWorkedAsAgentOrPosp"];
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
          <Box sx={{ gridColumn: "1 / -1" }}>
            <UploadPreviewBlock
              label="Upload Bank Proof"
              icon={<CloudUploadIcon />}
              accept="image/*,application/pdf"
              previewSrc={form.bankProofPreview}
              isPdf={form.bankProofFile?.type === "application/pdf"}
              pdfIndicator={<CloudUploadIcon sx={{ fontSize: 20, color: "error.main" }} />}
              inputRef={bankProofInputRef}
              onChange={handleBankProofChange}
            />
          </Box>

          {/* ── Declaration ── */}
          <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Typography sx={sectionTitleSx}>Declaration</Typography>
          </Box>
          <TextField
            label="Place"
            value={form.place}
            onChange={(e) => setField("place", e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />
          <UploadPreviewBlock
            label="Upload Signature"
            icon={<DrawIcon />}
            accept="image/*"
            previewSrc={form.signaturePreview}
            isPdf={false}
            inputRef={signatureInputRef}
            onChange={handleSignatureChange}
          />
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

          <Box sx={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
            <CtaButton type="submit" variant="role" disabled={!canSubmit}>
              Submit Registration
            </CtaButton>
          </Box>
        </Box>
      </form>
    </Box>
  );
}
