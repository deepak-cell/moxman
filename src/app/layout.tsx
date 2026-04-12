import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Moxman Fintech App",
  description: "Role-based insurance management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = "ADMIN";

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        data-role={role}
        className="min-h-full flex flex-col bg-[color:var(--color-surface)]"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
