"use client";

import { useMemo, useState } from "react";
import { Provider } from "react-redux";
import type { AppStore } from "@/lib/store";
import { makeStore } from "@/lib/store";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ToastProvider from "@/components/ui/ToastProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: { main: "#012269" },
          secondary: { main: "#D0142C" },
          background: {
            default: "#f6f8fc",
            paper: "#ffffff",
          },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
          h4: {
            fontSize: "2rem", // 32px
            "@media (max-width:600px)": {
              fontSize: "1.625rem", // 26px
            },
          },
          h5: {
            fontSize: "1.5rem", // 24px
            "@media (max-width:600px)": {
              fontSize: "1.25rem", // 20px
            },
          },
        },
      }),
    []
  );

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ToastProvider>{children}</ToastProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </Provider>
    </AppRouterCacheProvider>
  );
}
