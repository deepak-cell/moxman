"use client";

import { Button, ButtonProps, useTheme } from "@mui/material";
import { ReactNode } from "react";

type ThemeTone = "red" | "green" | "orange" | "blue" | "purple" | "role";

export type CtaButtonProps = Omit<ButtonProps, "variant"> & {
  variant?: ButtonProps["variant"] | ThemeTone;
  href?: string;
  fontSize?: number | string;
  iconSize?: number | string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export default function CtaButton({
  href,
  variant = "contained",
  fontSize,
  iconSize,
  startIcon,
  endIcon,
  sx,
  ...rest
}: CtaButtonProps) {
  const theme = useTheme();
  const isToneVariant =
    variant === "red" ||
    variant === "green" ||
    variant === "orange" ||
    variant === "blue" ||
    variant === "purple" ||
    variant === "role";
  const toneToPalette = {
    red: "error",
    green: "success",
    orange: "warning",
    blue: "primary",
    purple: "secondary",
  } as const;
  const paletteKey =
    isToneVariant && variant !== "role" ? toneToPalette[variant] : null;

  const iconSizing = iconSize
    ? {
        "& .MuiButton-startIcon svg": { fontSize: iconSize },
        "& .MuiButton-endIcon svg": { fontSize: iconSize },
        "& .MuiButton-startIcon": { marginRight: 6 },
        "& .MuiButton-endIcon": { marginLeft: 6 },
      }
    : {};

  const toneStyles =
    isToneVariant && variant === "role"
      ? {
          bgcolor: "var(--primary-color)",
          color: "#fff",
          "&:hover": {
            filter: "brightness(0.9)",
          },
        }
      : isToneVariant && paletteKey
        ? {
            bgcolor: theme.palette[paletteKey].main,
            color: theme.palette[paletteKey].contrastText,
            "&:hover": {
              bgcolor: theme.palette[paletteKey].dark,
            },
          }
        : {};

  return (
    <Button
      {...rest}
      variant={isToneVariant ? "contained" : variant}
      {...(href ? { component: "a" as const, href } : {})}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        fontSize: fontSize ?? 14,
        borderRadius: "0.688rem",
        ...iconSizing,
        ...toneStyles,
        ...sx,
      }}
    />
  );
}
