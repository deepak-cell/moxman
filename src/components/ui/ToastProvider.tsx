"use client";

import { Alert, Snackbar } from "@mui/material";
import { createContext, useContext, useMemo, useState } from "react";

type ToastPayload = {
  message: string;
  severity?: "success" | "info" | "warning" | "error";
  duration?: number;
};

type ToastContextValue = {
  showToast: (payload: ToastPayload) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const [open, setOpen] = useState(false);

  const showToast = (payload: ToastPayload) => {
    setToast(payload);
    setOpen(true);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={toast?.duration ?? 3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={toast?.severity ?? "info"}
          variant="filled"
          sx={{ borderRadius: "0.688rem" }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}
