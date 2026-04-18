"use client";

import { Box, Button, Typography } from "@mui/material";
import type { ChangeEvent, ReactNode, RefObject } from "react";

export default function UploadPreviewBlock({
  label,
  icon,
  accept,
  previewSrc,
  isPdf,
  pdfIndicator,
  inputRef,
  onChange,
}: {
  label: string;
  icon: ReactNode;
  accept: string;
  previewSrc: string;
  isPdf?: boolean;
  pdfIndicator?: ReactNode;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
      <input ref={inputRef} type="file" accept={accept} hidden onChange={onChange} />
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

      {previewSrc ? (
        isPdf ? (
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
            {pdfIndicator ?? null}
            <Typography variant="caption" color="text.secondary">
              PDF uploaded
            </Typography>
          </Box>
        ) : (
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
      ) : null}
    </Box>
  );
}
