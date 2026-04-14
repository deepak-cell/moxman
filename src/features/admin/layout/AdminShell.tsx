"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  Avatar,
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PolicyRoundedIcon from "@mui/icons-material/PolicyRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import PercentRoundedIcon from "@mui/icons-material/PercentRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const drawerWidth = 240;

export type AdminShellProps = {
  userName?: string | null;
  userRole?: string | null;
  children: React.ReactNode;
};

type RoleKey =
  | "ADMIN"
  | "SUB_ADMIN"
  | "BRANCH_MANAGER"
  | "RELATIONSHIP_MANAGER"
  | "PARTNER";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: RoleKey[];
};

type NavGroup = {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    id: "user_mgmt",
    label: "User Management",
    icon: <ManageAccountsRoundedIcon />,
    items: [
      {
        label: "Partners",
        href: "/admin/users/partners",
        icon: <PersonAddAltRoundedIcon />,
        roles: ["ADMIN", "SUB_ADMIN", "BRANCH_MANAGER", "RELATIONSHIP_MANAGER"],
      },
      {
        label: "Relationship Managers",
        href: "/admin/users/relationship-managers",
        icon: <SupervisorAccountRoundedIcon />,
        roles: ["ADMIN", "SUB_ADMIN", "BRANCH_MANAGER"],
      },
      {
        label: "Branch Managers",
        href: "/admin/users/branch-managers",
        icon: <AccountTreeRoundedIcon />,
        roles: ["ADMIN", "SUB_ADMIN"],
      },
      {
        label: "Sub Admins",
        href: "/admin/users/sub-admins",
        icon: <AdminPanelSettingsRoundedIcon />,
        roles: ["ADMIN"],
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: <Inventory2RoundedIcon />,
    items: [
      {
        label: "Customers",
        href: "/admin/clients",
        icon: <BusinessRoundedIcon />,
        roles: ["ADMIN"],
      },
      {
        label: "Branches",
        href: "/admin/branches",
        icon: <AccountTreeRoundedIcon />,
        roles: ["ADMIN", "SUB_ADMIN"],
      },
      {
        label: "Policies",
        href: "/admin/policies",
        icon: <PolicyRoundedIcon />,
        roles: ["ADMIN", "PARTNER"],
      },
      {
        label: "Slabs",
        href: "/admin/slabs",
        icon: <LayersRoundedIcon />,
        roles: ["ADMIN"],
      },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: <AssessmentRoundedIcon />,
    items: [
      {
        label: "Reports",
        href: "/admin/reports",
        icon: <AssessmentRoundedIcon />,
        roles: [
          "ADMIN",
          "SUB_ADMIN",
          "BRANCH_MANAGER",
          "RELATIONSHIP_MANAGER",
          "PARTNER",
        ],
      },
    ],
  },
];

// Custom hamburger / close toggle icon
function MenuToggleIcon({ open }: { open: boolean }) {
  const color = "#012269";
  const bar = {
    display: "block",
    height: "2px",
    background: color,
    borderRadius: "2px",
    transition: "all 0.25s ease",
  };

  if (!open) {
    // Two-bar X / close shape
    return (
      <Box
        sx={{
          width: 22,
          height: 22,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* First diagonal bar (top-left to bottom-right) */}
        <Box
          component="span"
          sx={{
            ...bar,
            position: "absolute",
            width: "22px",
            transform: "rotate(45deg)",
          }}
        />
        {/* Second diagonal bar (top-right to bottom-left) */}
        <Box
          component="span"
          sx={{
            ...bar,
            position: "absolute",
            width: "22px",
            transform: "rotate(-45deg)",
          }}
        />
      </Box>
    );
  }

  // Three-bar hamburger — middle bar is shorter (default open state)
  return (
    <Box
      sx={{
        width: 22,
        height: 16,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box component="span" sx={{ ...bar, width: "22px" }} />
      <Box component="span" sx={{ ...bar, width: "14px" }} />
      <Box component="span" sx={{ ...bar, width: "22px" }} />
    </Box>
  );
}

export default function AdminShell({
  userName,
  userRole,
  children,
}: AdminShellProps) {
  const [open, setOpen] = useState(true);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const roleKey = (userRole ?? "ADMIN")
    .toUpperCase()
    .replace(/\s+/g, "_") as RoleKey;

  const visibleGroups = useMemo(
    () =>
      navGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.roles.includes(roleKey)),
        }))
        .filter((group) => group.items.length > 0),
    [roleKey],
  );

  const activeGroupId = useMemo(() => {
    for (const group of navGroups) {
      const match = group.items.find(
        (item) => pathname === item.href || pathname?.startsWith(`${item.href}/`),
      );
      if (match) return group.id;
    }
    return null;
  }, [pathname]);

  const [groupOpen, setGroupOpen] = useState<Record<string, boolean>>(() => ({
    user_mgmt: activeGroupId === "user_mgmt",
    operations: activeGroupId === "operations",
    reports: activeGroupId === "reports",
  }));
  const isProfileMenuOpen = Boolean(profileAnchorEl);

  const handleGroupFocus = (groupId: string | null) => {
    setGroupOpen((prev) => {
      const nextState: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        nextState[key] = groupId ? key === groupId : false;
      });
      return nextState;
    });
  };

  useEffect(() => {
    if (!activeGroupId) return;
    setGroupOpen((prev) => {
      const nextState: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        nextState[key] = key === activeGroupId;
      });
      return nextState;
    });
  }, [activeGroupId]);

  const renderNavItem = (item: NavItem, groupId: string | null) => {
    const isActive =
      (item.href === "/admin/users"
        ? pathname === "/admin/users"
        : pathname === item.href || pathname?.startsWith(`${item.href}/`)) ||
      (item.href === "/admin/dashboard" && pathname === "/admin");
    const isSubItem = groupId !== null;

    return (
      <ListItemButton
        key={item.label}
        component="a"
        href={item.href}
        selected={isActive}
        onClick={() => handleGroupFocus(groupId)}
        sx={{
          zIndex: 10,
          ml: open ? (isSubItem ? 3 : 1) : 1,
          pl: isSubItem ? (open ? 6 : 2) : undefined,
          px: open ? 0.75 : 1.5,
          my: isActive ? 1.5 : 0.625,
          py: 0.5,
          color: "rgba(255,255,255,0.78)",
          borderRadius: "999px 0 0 999px",
          position: "relative",
          "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
          "&:hover .MuiListItemText-primary": {
            transform: "translateX(6px)",
          },
          "&.Mui-selected": {
            bgcolor: "var(--bg-color)",
            color: "var(--primary-color)",
          },
          "&.Mui-selected .MuiListItemText-primary": {
            color: "var(--primary-color)",
          },
          "&.Mui-selected:hover": { bgcolor: "var(--bg-color)" },
          "&.Mui-selected::before": {
            content: '""',
            position: "absolute",
            top: -20,
            right: 0,
            width: 20,
            height: 20,
            background: "var(--sidebar-color)",
            borderBottomRightRadius: 20,
            zIndex: 9,
          },
          "&.Mui-selected::after": {
            content: '""',
            position: "absolute",
            bottom: -20,
            right: 0,
            width: 20,
            height: 20,
            background: "var(--sidebar-color)",
            borderTopRightRadius: 20,
            zIndex: 9,
          },
        }}
      >
        {isActive && (
          <>
            <Box
              component="span"
              className="for-top-curve"
              sx={{
                position: "absolute",
                top: "-20px",
                right: 0,
                width: "20px",
                height: "20px",
                background: "var(--bg-color)",
              }}
            />
            <Box
              component="span"
              className="for-bottom-curve"
              sx={{
                position: "absolute",
                bottom: "-20px",
                right: 0,
                width: "20px",
                height: "20px",
                background: "var(--bg-color)",
              }}
            />
          </>
        )}
        <ListItemIcon
          sx={{
            minWidth: open ? (isSubItem ? 34 : 40) : 32,
            color: "inherit",
            "& .nav-icon": {
              display: "grid",
              placeItems: "center",
              width: isSubItem ? 26 : 32,
              height: isSubItem ? 26 : 32,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.16)",
              transition: "all 0.2s ease",
            },
            ".Mui-selected & .nav-icon": {
              background: "var(--primary-color)",
              borderColor: "transparent",
              boxShadow: "0 6px 12px rgba(0,0,0,0.18)",
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
              fontSize: isSubItem ? 12.5 : 14,
              fontWeight: 500,
              transform: "translateX(0)",
              transition: "transform 0.2s ease",
            },
          }}
        />
      </ListItemButton>
    );
  };

  const canView = (roles: RoleKey[]) => roles.includes(roleKey);

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
        // Use an inset shadow instead of a border so active menu items can sit flush
        // to the edge without needing layout hacks (negative margins / width tweaks).
        borderRight: "none",
        boxShadow: "inset -1px 0 0 rgba(255,255,255,0.08)",
        overflow: "visible",
        display: "flex",
        flexDirection: "column",
      },
    }),
    [open],
  );

  return (
    <Box
      data-role={roleKey}
      sx={{ display: "flex", minHeight: "100vh", bgcolor: "var(--bg-color)" }}
    >
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
            edge="start"
            onClick={() => setOpen((prev) => !prev)}
            disableRipple
            sx={{
              p: "6px",
              "&:hover": { bgcolor: "transparent" },
            }}
          >
            <MenuToggleIcon open={open} />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ textAlign: "right", mr: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {userName ?? "Admin"}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {userRole ?? "ADMIN"}
            </Typography>
          </Box>
          <IconButton
            onClick={(event) => setProfileAnchorEl(event.currentTarget)}
            sx={{ p: 0 }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: "var(--primary-color)",
                fontSize: 14,
              }}
            >
              {(userName ?? "A").charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={profileAnchorEl}
            open={isProfileMenuOpen}
            onClose={() => setProfileAnchorEl(null)}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: "0.688rem",
                minWidth: 360,
                width: 360,
                boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
              },
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {userName ?? "Admin"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {userRole ?? "ADMIN"}
              </Typography>
            </Box>
            <MenuItem onClick={() => setProfileAnchorEl(null)}>
              <ListItemIcon>
                <PersonOutlineRoundedIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => setProfileAnchorEl(null)}>
              <ListItemIcon>
                <TimelineRoundedIcon fontSize="small" />
              </ListItemIcon>
              Activity
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={drawerSx}>
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: open ? 2 : 1.5,
            }}
          >
          {open ? (
            <Image
              src="/logo-white.svg"
              alt="Moxman"
              width={170}
              height={34}
              priority
            />
          ) : (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Image
                src="/logo-mark-white.svg"
                alt="Moxman"
                width={24}
                height={24}
                style={{ width: "24px", height: "24px" }}
              />
            </Box>
          )}
        </Toolbar>
          <List sx={{ flex: 1, overflowY: "auto", pb: 2 }}>
            {canView(["ADMIN", "SUB_ADMIN"]) &&
              renderNavItem(
                {
                  label: "Dashboard",
                  href: "/admin/dashboard",
                  icon: <DashboardRoundedIcon />,
                  roles: ["ADMIN", "SUB_ADMIN"],
                },
                null,
              )}
            {canView(["ADMIN"]) &&
              renderNavItem(
                {
                  label: "Payments",
                  href: "/admin/payments",
                  icon: <PaymentsRoundedIcon />,
                  roles: ["ADMIN"],
                },
                null,
              )}
            {visibleGroups.map((group) => {
              const isExpanded = open ? groupOpen[group.id] : true;
              return (
                <Box key={group.id}>
                  {open && (
                    <ListItemButton
                      disableGutters
                      onClick={() =>
                        setGroupOpen((prev) => {
                          const isCurrentlyOpen = !!prev[group.id];
                          const nextState: Record<string, boolean> = {};
                          Object.keys(prev).forEach((key) => {
                            nextState[key] = false;
                          });
                          if (!isCurrentlyOpen) {
                            nextState[group.id] = true;
                          }
                          return nextState;
                        })
                      }
                      sx={{
                        zIndex: 10,
                        mt: 1,
                        mb: 0.5,
                        ml: 1,
                        mr: 0,
                        px: "5px",
                        borderRadius: 2,
                        color: "rgba(255,255,255,0.8)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: open ? 34 : 28,
                          color: "inherit",
                          "& .nav-icon": {
                            display: "grid",
                            placeItems: "center",
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,0.16)",
                          },
                        }}
                      >
                        <Box className="nav-icon">{group.icon}</Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={group.label}
                        sx={{
                          "& .MuiListItemText-primary": {
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                          },
                        }}
                      />
                      {groupOpen[group.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItemButton>
                  )}
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit={!open}>
                    <List disablePadding>
                      {group.items.map((item) => renderNavItem(item, group.id))}
                    </List>
                  </Collapse>
                </Box>
              );
            })}
          </List>
          <Box sx={{ px: 2, pb: 2, display: "flex", justifyContent: "center" }}>
            <ListItemButton
              onClick={() => router.push("/login")}
              sx={{
                width: open ? "100%" : 40,
                justifyContent: open ? "flex-start" : "center",
                borderRadius: 999,
                color: "rgba(255,255,255,0.92)",
                bgcolor: "rgba(255,255,255,0.08)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: open ? 34 : 0,
                  color: "inherit",
                }}
              >
                <LogoutRoundedIcon fontSize="small" />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary="Log Out"
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontSize: 13,
                      fontWeight: 600,
                    },
                  }}
                />
              )}
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flex: 1,
          pt: 3,
          px: 3,
          pb: 3,
          transition: "margin 0.2s ease",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
