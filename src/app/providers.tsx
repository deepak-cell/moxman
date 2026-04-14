"use client";

import { useMemo, useState } from "react";
import { Provider } from "react-redux";
import type { AppStore } from "@/lib/store";
import { makeStore } from "@/lib/store";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ToastProvider from "@/components/ui/ToastProvider";

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
        },
      }),
    []
  );

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </Provider>
    </AppRouterCacheProvider>
  );
}
