"use client";

import { useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

export type AdminShellProps = {
  userName?: string | null;
  userRole?: string | null;
  children: React.ReactNode;
};

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Clients", href: "/admin/clients" },
  { label: "Policies", href: "/admin/policies" },
  { label: "Products", href: "/admin/products" },
  { label: "Slabs", href: "/admin/slabs" },
  { label: "Commissions", href: "/admin/commissions" },
  { label: "Payments", href: "/admin/payments" },
  { label: "Reports", href: "/admin/reports" },
];

export default function AdminShell({ userName, userRole, children }: AdminShellProps) {
  const [open, setOpen] = useState(true);

  const drawerSx = useMemo(
    () => ({
      width: open ? drawerWidth : 72,
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        width: open ? drawerWidth : 72,
        boxSizing: "border-box",
        bgcolor: "var(--sidebar-color)",
        color: "white",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      },
    }),
    [open]
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "var(--bg-color)" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "var(--header-color)",
          color: "white",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen((prev) => !prev)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Moxman Admin
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {userName ?? "Admin"}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {userRole ?? "ADMIN"}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={drawerSx}>
        <Toolbar />
        <Box sx={{ px: open ? 2 : 1, py: 2 }}>
          <Typography
            variant="caption"
            sx={{
              opacity: open ? 0.7 : 0,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            Navigation
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.label}
              component="a"
              href={item.href}
              sx={{
                px: open ? 2 : 1.5,
                py: 1.2,
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              <ListItemText
                primary={item.label}
                sx={{
                  opacity: open ? 1 : 0,
                  transition: "opacity 0.2s",
                  "& .MuiListItemText-primary": {
                    fontSize: 14,
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flex: 1,
          pt: 8,
          px: 3,
          pb: 3,
          ml: open ? `${drawerWidth}px` : "72px",
          transition: "margin 0.2s ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
