"use client";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { SxProps, Theme } from "@mui/material/styles";

type DatePickerFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
  disableFuture?: boolean;
  disablePast?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
};

function toDayjs(value: string): Dayjs | null {
  if (!value) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
}

const defaultFieldSx: SxProps<Theme> = {
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

export default function DatePickerField({
  label,
  value,
  onChange,
  required,
  fullWidth = true,
  sx,
  disableFuture,
  disablePast,
  minDate,
  maxDate,
}: DatePickerFieldProps) {
  return (
    <DatePicker
      label={label}
      value={toDayjs(value)}
      onChange={(newValue) => onChange(newValue?.format("YYYY-MM-DD") ?? "")}
      format="DD/MM/YYYY"
      disableFuture={disableFuture}
      disablePast={disablePast}
      minDate={minDate}
      maxDate={maxDate}
      slotProps={{
        textField: {
          required,
          fullWidth,
          sx: [defaultFieldSx, sx],
        },
        openPickerButton: {
          size: "small",
        },
      }}
    />
  );
}
