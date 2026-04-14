"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PolicyRoundedIcon from "@mui/icons-material/PolicyRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import PercentRoundedIcon from "@mui/icons-material/PercentRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";

const drawerWidth = 240;

export type AdminShellProps = {
  userName?: string | null;
  userRole?: string | null;
  children: React.ReactNode;
};

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <DashboardRoundedIcon /> },
  { label: "Users", href: "/admin/users", icon: <PeopleAltRoundedIcon /> },
  { label: "Clients", href: "/admin/clients", icon: <BusinessRoundedIcon /> },
  { label: "Policies", href: "/admin/policies", icon: <PolicyRoundedIcon /> },
  { label: "Products", href: "/admin/products", icon: <Inventory2RoundedIcon /> },
  { label: "Slabs", href: "/admin/slabs", icon: <LayersRoundedIcon /> },
  { label: "Commissions", href: "/admin/commissions", icon: <PercentRoundedIcon /> },
  { label: "Payments", href: "/admin/payments", icon: <PaymentsRoundedIcon /> },
  { label: "Reports", href: "/admin/reports", icon: <AssessmentRoundedIcon /> },
];

export default function AdminShell({ userName, userRole, children }: AdminShellProps) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  const drawerSx = useMemo(
    () => ({
      width: open ? drawerWidth : 72,
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        width: open ? drawerWidth : 72,
        boxSizing: "border-box",
        bgcolor: "var(--sidebar-color)",
        color: "white",
        zIndex: 1202,
        borderRight: "1px solid rgba(255,255,255,0.08)",
        overflow: "visible",
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
          bgcolor: "rgb(255, 255, 255)",
          color: "white",
          boxShadow: "-7.829px 11.607px 20px 0 rgba(144, 143, 160, .09)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          ml: open ? `${drawerWidth}px` : "72px",
          width: open ? `calc(100% - ${drawerWidth}px)` : "calc(100% - 72px)",
          transition: "margin 0.2s ease, width 0.2s ease",
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
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "flex-start" : "center",
            px: open ? 2 : 1.5,
          }}
        >
          <Image
            src="/logo-white.svg"
            alt="Moxman"
            width={140}
            height={30}
            style={{ width: open ? "140px" : "32px", height: "auto" }}
            priority
          />
        </Toolbar>
        <List>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname?.startsWith(`${item.href}/`) ||
              (item.href === "/admin/dashboard" && pathname === "/admin");
            return (
              <ListItemButton
                key={item.label}
                component="a"
                href={item.href}
                selected={isActive}
                sx={{
                  mr: 0,
                  ml: open ? 2 : 1,
                  px: open ? .5 : 1.5,
                  py: .5,
                  color: "rgba(255,255,255,0.78)",
                  borderRadius: "999px 0 0 999px",
                  position: "relative",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                  "&.Mui-selected": {
                    bgcolor: "var(--bg-color)",
                    color: "#6d5dfc",
                    boxShadow: "16px 0 0 var(--bg-color)",
                  },
                  "&.Mui-selected .MuiListItemText-primary":{
                    color:"var(--primary-color)"
                  },
                  "&.Mui-selected:hover": { bgcolor: "var(--bg-color)" },
                  "&.Mui-selected::before": {
                    content: '""',
                    position: "absolute",
                    top: -30,
                    insetInlineEnd: 0,
                    bottom: 0,
                    height: 30,
                    width: 30,
                    borderTopColor: "transparent",
                    borderLeftColor: "transparent",
                    borderBottom: "transparent",
                    borderStartStartRadius: 0,
                    borderStartEndRadius: 0,
                    borderEndEndRadius: 48,
                    borderEndStartRadius: 0,
                    borderInlineEnd: "20px solid var(--sidebar-color)",
                    zIndex: 9,
                  },
                  "&.Mui-selected::after": {
                    content: '""',
                    position: "absolute",
                    insetInlineEnd: 0,
                    bottom: -30,
                    width: 30,
                    height: 30,
                    borderBottomColor: "transparent",
                    borderLeftColor: "transparent",
                    borderTop: "transparent",
                    borderStartStartRadius: 0,
                    borderStartEndRadius: 48,
                    borderEndEndRadius: 0,
                    borderEndStartRadius: 0,
                    borderInlineEnd: "20px solid var(--sidebar-color)",
                    zIndex: 9,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: open ? 40 : 32,
                    color: "inherit",
                    "& .nav-icon": {
                      display: "grid",
                      placeItems: "center",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.16)",
                      transition: "all 0.2s ease",
                    },
                    ".Mui-selected & .nav-icon": {
                      background:
                        "linear-gradient(135deg, rgba(109,93,252,1) 0%, rgba(99,84,247,1) 100%)",
                      borderColor: "transparent",
                      boxShadow: "0 6px 12px rgba(109,93,252,0.35)",
                      color: "#fff",
                    },
                  }}
                >
                  <Box className="nav-icon">{item.icon}</Box>
                </ListItemIcon>
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
            );
          })}
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
