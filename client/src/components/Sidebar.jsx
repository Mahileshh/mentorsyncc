import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Avatar,
  Divider,
  Badge,
  Box,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  BeachAccess as LeaveIcon,
  Work as PlacementIcon,
  EmojiEvents as RewardsIcon,
  Logout as LogoutIcon,
  MenuBook as LogoIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation, Link } from "react-router-dom";

const DRAWER_WIDTH = 256;

const navItems = [
  { text: "Dashboard", path: "/student", icon: <DashboardIcon fontSize="small" />, exact: true },
  { text: "Apply Leave", path: "/student/apply-leave", icon: <LeaveIcon fontSize="small" /> },
  { text: "Leave History", path: "/student/leave-history", icon: <HistoryIcon fontSize="small" /> },
  { text: "Placement Request", path: "/student/placement", icon: <PlacementIcon fontSize="small" /> },
  { text: "My Rewards", path: "/student/rewards", icon: <RewardsIcon fontSize="small" /> },
  { text: "Course Exemptions", path: "/student/exemptions", icon: <LogoIcon fontSize="small" /> },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const studentName = localStorage.getItem("name") || "Student";
  const studentEmail = localStorage.getItem("email") || "";

  const isActive = (item) =>
    item.exact
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          border: "none",
          background: "#0F172A",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
        },
      }}
    >
      {/* Brand */}
      <Box sx={{ px: 3, pt: 3.5, pb: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "7px",
            bgcolor: "#4F46E5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <LogoIcon sx={{ fontSize: 17, color: "#fff" }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#F1F5F9", lineHeight: 1.1 }}>
            MentorSync
          </Typography>
          <Typography sx={{ fontSize: "0.68rem", color: "#475569", letterSpacing: "0.6px", textTransform: "uppercase" }}>
            Student Portal
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: 2 }} />

      {/* User section */}
      <Box
        sx={{
          mx: 2,
          my: 2,
          p: 1.5,
          borderRadius: "8px",
          bgcolor: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
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
              bgcolor: "#22C55E",
              width: 9,
              height: 9,
              border: "1.5px solid #0F172A",
              borderRadius: "50%",
            },
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#4F46E5",
              fontSize: "0.8rem",
              fontWeight: 700,
            }}
          >
            {studentName.charAt(0).toUpperCase()}
          </Avatar>
        </Badge>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.82rem",
              color: "#F1F5F9",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {studentName}
          </Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {studentEmail || "Student"}
          </Typography>
        </Box>
      </Box>

      {/* Nav label */}
      <Typography
        sx={{
          px: 3,
          pb: 0.5,
          fontSize: "0.63rem",
          fontWeight: 600,
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: "#334155",
        }}
      >
        Menu
      </Typography>

      {/* Nav items */}
      <List sx={{ px: 1.5, flex: 1, pt: 0.5 }}>
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <ListItemButton
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                borderRadius: "6px",
                mb: 0.5,
                py: 0.9,
                px: 1.5,
                position: "relative",
                bgcolor: active ? "rgba(79,70,229,0.15)" : "transparent",
                "&:hover": {
                  bgcolor: active ? "rgba(79,70,229,0.2)" : "rgba(255,255,255,0.04)",
                },
                ...(active && {
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    height: "55%",
                    width: "2.5px",
                    borderRadius: "0 2px 2px 0",
                    bgcolor: "#818CF8",
                  },
                }),
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 34,
                  color: active ? "#818CF8" : "#475569",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.855rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#E0E7FF" : "#94A3B8",
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ px: 1.5, pb: 3 }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 1.5 }} />
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: "6px",
            py: 0.9,
            px: 1.5,
            color: "#64748B",
            "&:hover": { bgcolor: "rgba(239,68,68,0.08)", color: "#F87171" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 34, color: "inherit" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontSize: "0.855rem", fontWeight: 500 }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}

export default Sidebar;