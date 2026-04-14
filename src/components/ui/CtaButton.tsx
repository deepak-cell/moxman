"use client";

import { Button, ButtonProps } from "@mui/material";
import { ReactNode } from "react";

export type CtaButtonProps = ButtonProps & {
  href?: string;
  fontSize?: number | string;
  iconSize?: number | string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export default function CtaButton({
  href,
  fontSize,
  iconSize,
  startIcon,
  endIcon,
  sx,
  ...rest
}: CtaButtonProps) {
  const iconSizing = iconSize
    ? {
        "& .MuiButton-startIcon svg": { fontSize: iconSize },
        "& .MuiButton-endIcon svg": { fontSize: iconSize },
        "& .MuiButton-startIcon": { marginRight: 6 },
        "& .MuiButton-endIcon": { marginLeft: 6 },
      }
    : {};

  return (
    <Button
      {...rest}
      {...(href ? { component: "a" as const, href } : {})}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        fontSize: fontSize ?? 14,
        borderRadius: "0.688rem",
        ...iconSizing,
        ...sx,
      }}
    />
  );
}
