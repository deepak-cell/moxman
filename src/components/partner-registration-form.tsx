"use client";

import {
  Box,
  Button,
  Typography,
  TextField,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useState } from "react";

export default function PartnerRegistrationForm() {
  const [form, setForm] = useState({
    fullName: "",
    fatherName: "",
    dob: "",
    gender: "",
    mobile: "",
    email: "",
    aadhaar: "",
    pan: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    accepted: false,
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const inputStyles = {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      color: "var(--primary-color)",
      background: "rgba(255,255,255,0.08)",
    },
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 900,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" mb={3} color="white">
        Partner Registration
      </Typography>

      <form onSubmit={onSubmit}>
        {/* Personal Info */}
        <Typography color="white" mb={1}>
          Personal Information
        </Typography>

        <TextField
          fullWidth
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          sx={inputStyles}
        />

        <TextField
          fullWidth
          placeholder="Father / Husband Name"
          value={form.fatherName}
          onChange={(e) => handleChange("fatherName", e.target.value)}
          sx={inputStyles}
        />

        <TextField
          fullWidth
          type="date"
          value={form.dob}
          onChange={(e) => handleChange("dob", e.target.value)}
          sx={inputStyles}
        />

        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />

        {/* Contact */}
        <Typography color="white" mb={1}>
          Contact Details
        </Typography>

        <TextField
          fullWidth
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={(e) => handleChange("mobile", e.target.value)}
          sx={inputStyles}
        />

        <TextField
          fullWidth
          placeholder="Email ID"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          sx={inputStyles}
        />

        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />

        {/* KYC */}
        <Typography color="white" mb={1}>
          KYC Details
        </Typography>

        <TextField
          fullWidth
          placeholder="Aadhaar Number"
          value={form.aadhaar}
          onChange={(e) => handleChange("aadhaar", e.target.value)}
          sx={inputStyles}
        />

        <TextField
          fullWidth
          placeholder="PAN Number"
          value={form.pan}
          onChange={(e) => handleChange("pan", e.target.value)}
          sx={inputStyles}
        />

        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />

        {/* Bank */}
        <Typography color="white" mb={1}>
          Bank Details
        </Typography>

        <TextField
          fullWidth
          placeholder="Bank Name"
          value={form.bankName}
          onChange={(e) => handleChange("bankName", e.target.value)}
          sx={inputStyles}
        />

        <TextField
          fullWidth
          placeholder="Account Number"
          value={form.accountNumber}
          onChange={(e) => handleChange("accountNumber", e.target.value)}
          sx={inputStyles}
        />

        <TextField
          fullWidth
          placeholder="IFSC Code"
          value={form.ifsc}
          onChange={(e) => handleChange("ifsc", e.target.value)}
          sx={inputStyles}
        />

        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />

        {/* Declaration */}
        <FormControlLabel
          control={
            <Checkbox
              checked={form.accepted}
              onChange={(e) => handleChange("accepted", e.target.checked)}
            />
          }
          label={
            <Typography color="white">
              I confirm all details are correct
            </Typography>
          }
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </form>
    </Box>
  );
}