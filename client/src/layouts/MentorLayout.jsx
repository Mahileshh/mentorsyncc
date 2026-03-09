import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Avatar,
  Divider,
  Badge,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  School as StudentsIcon,
  BeachAccess as LeaveIcon,
  Work as PlacementIcon,
  EmojiEvents as RewardsIcon,
  Logout as LogoutIcon,
  MenuBook as MenuBookIcon,
} from "@mui/icons-material";

const DRAWER_WIDTH = 265;

const navItems = [
  { text: "Dashboard", path: "/mentor", icon: <DashboardIcon />, exact: true },
  { text: "My Students", path: "/mentor/students", icon: <StudentsIcon /> },
  { text: "Leave Requests", path: "/mentor/leaves", icon: <LeaveIcon /> },
  { text: "Placement Requests", path: "/mentor/placements", icon: <PlacementIcon /> },
  { text: "Reward Points", path: "/mentor/rewards", icon: <RewardsIcon /> },
];

export default function MentorLayout() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const mentorName = localStorage.getItem("name") || "Mentor";
  const mentorEmail = localStorage.getItem("email") || "";

  const isActive = (item) =>
    item.exact
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f0f2f5" }}>
      {/* ─── Sidebar ─── */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
            background: "linear-gradient(180deg, #1a1f37 0%, #111827 100%)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
          },
        }}
      >
        {/* Brand */}
        <Box
          sx={{
            px: 3,
            pt: 3.5,
            pb: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 14px rgba(99,102,241,0.45)",
            }}
          >
            <MenuBookIcon sx={{ fontSize: 20, color: "#fff" }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.05rem",
                letterSpacing: "0.3px",
                color: "#fff",
                lineHeight: 1.1,
              }}
            >
              MentorSync
            </Typography>
            <Typography
              sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.8px", textTransform: "uppercase" }}
            >
              Mentor Portal
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: 2, mb: 1 }} />

        {/* User Profile Card */}
        <Box
          sx={{
            mx: 2,
            my: 1.5,
            p: 1.5,
            borderRadius: 2.5,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            sx={{
              "& .MuiBadge-badge": {
                bgcolor: "#22c55e",
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: "2px solid #111827",
              },
            }}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                fontSize: "1rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              {mentorName.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.85rem",
                color: "#fff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {mentorName}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.45)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {mentorEmail || "Mentor"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: 2, mb: 1 }} />

        {/* Navigation */}
        <Typography
          sx={{
            px: 3,
            pt: 1,
            pb: 0.5,
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          Navigation
        </Typography>
        <List sx={{ px: 1.5, flex: 1 }}>
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Tooltip title="" key={item.text} placement="right">
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    py: 1.1,
                    px: 1.5,
                    position: "relative",
                    transition: "all 0.18s ease",
                    background: active
                      ? "linear-gradient(90deg, rgba(99,102,241,0.25) 0%, rgba(99,102,241,0.08) 100%)"
                      : "transparent",
                    "&:hover": {
                      background: active
                        ? "linear-gradient(90deg, rgba(99,102,241,0.3) 0%, rgba(99,102,241,0.12) 100%)"
                        : "rgba(255,255,255,0.05)",
                    },
                    ...(active && {
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "20%",
                        height: "60%",
                        width: 3,
                        borderRadius: "0 3px 3px 0",
                        background: "linear-gradient(180deg, #6366f1, #8b5cf6)",
                      },
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 38,
                      color: active ? "#818cf8" : "rgba(255,255,255,0.45)",
                      transition: "color 0.18s",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: active ? 600 : 400,
                      color: active ? "#e0e7ff" : "rgba(255,255,255,0.65)",
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>

        {/* Bottom: Logout */}
        <Box sx={{ px: 1.5, pb: 2 }}>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 1.5 }} />
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              py: 1.1,
              px: 1.5,
              color: "rgba(255,100,100,0.85)",
              transition: "all 0.18s",
              "&:hover": {
                background: "rgba(239,68,68,0.1)",
                color: "#f87171",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }}
            />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* ─── Main Content ─── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          bgcolor: "#f0f2f5",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            px: 4,
            py: 2,
            bgcolor: "#fff",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <Box>
            <Typography
              sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#1e293b" }}
            >
              {navItems.find((item) => isActive(item))?.text ?? "Dashboard"}
            </Typography>
            <Typography sx={{ fontSize: "0.78rem", color: "#94a3b8", mt: 0.1 }}>
              Welcome back, {mentorName} 👋
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 38,
              height: 38,
              fontSize: "0.95rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              cursor: "pointer",
            }}
          >
            {mentorName.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        {/* Page Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3.5 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
