import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Button,
  Divider,
  LinearProgress,
  Skeleton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  Group as GroupIcon,
  BeachAccess as LeaveIcon,
  Work as PlacementIcon,
  EmojiEvents as RewardsIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const AVATAR_COLORS = ["#4F46E5", "#0EA5E9", "#16A34A", "#D97706", "#DC2626", "#7C3AED"];
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const initials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

function StatCard({ label, value, sub, icon, color, loading }) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", flex: 1, width: "100%", minHeight: 200 }}>
      <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {loading ? (
          <>
            <Skeleton variant="text" width={50} height={40} />
            <Skeleton variant="text" width={90} />
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
              <Box>
                <Typography
                  sx={{ fontSize: "1.9rem", fontWeight: 800, color: "#0F172A", lineHeight: 1, letterSpacing: "-0.02em" }}
                >
                  {value}
                </Typography>
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#64748B", mt: 0.5 }}>
                  {label}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: `${color}15`,
                  color: color,
                  borderRadius: "8px",
                }}
              >
                {icon}
              </Avatar>
            </Box>
            {sub && (
              <Typography sx={{ fontSize: "0.73rem", color: "#94A3B8" }}>
                {sub}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  const mentorName = localStorage.getItem("name") || "Mentor";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, l, p] = await Promise.all([
          api.get("/mentor/mentorstudents"),
          api.get("/mentor/leaves"),
          api.get("/mentor/placements"),
        ]);
        setStudents(s.data);
        setLeaves(l.data);
        setPlacements(p.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingLeaves = leaves.filter((l) => l.status === "pending").length;
  const approvedLeaves = leaves.filter((l) => l.status === "approved").length;
  // Placement status is "Pending Mentor" when awaiting review
  const pendingPlacements = placements.filter((p) => p.status === "Pending Mentor").length;
  const approvedPlacements = placements.filter((p) => p.status === "Mentor Verified" || p.status === "approved").length;
  const leaveApprovalRate = leaves.length > 0 ? Math.round((approvedLeaves / leaves.length) * 100) : 0;
  const pendingItems = [
    ...leaves.filter((l) => l.status === "pending").slice(0, 3).map((l) => ({
      label: l.studentName || "Student",
      sub: `${l.leaveType || "Leave"} · ${l.reason?.slice(0, 25) || "Leave request"}`,
      color: "#D97706",
      chip: "Leave",
    })),
    ...placements.filter((p) => p.status === "Pending Mentor").slice(0, 2).map((p) => ({
      label: p.studentName || "Student",
      sub: `Placement · ${p.company || "Application"}`,
      color: "#4F46E5",
      chip: "Placement",
    })),
  ].slice(0, 5);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* Page header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: "#0F172A", letterSpacing: "-0.02em" }}>
          Overview
        </Typography>
        <Typography sx={{ color: "#64748B", fontSize: "0.865rem", mt: 0.25 }}>
          Good day, {mentorName}. Here's what's happening with your students.
        </Typography>
      </Box>

      {/* KPI cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }} alignItems="stretch">
        <Grid item xs={12} sm={6} lg={3} sx={{ display: "flex" }}>
          <StatCard label="Total Students" value={students.length} sub="Assigned to you" icon={<GroupIcon sx={{ fontSize: 18 }} />} color="#4F46E5" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={{ display: "flex" }}>
          <StatCard label="Pending Leaves" value={pendingLeaves} sub={`${approvedLeaves} approved`} icon={<LeaveIcon sx={{ fontSize: 18 }} />} color="#D97706" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={{ display: "flex" }}>
          <StatCard label="Pending Placements" value={pendingPlacements} sub={`${approvedPlacements} approved`} icon={<PlacementIcon sx={{ fontSize: 18 }} />} color="#0EA5E9" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={{ display: "flex" }}>
          <StatCard label="Approval Rate" value={`${leaveApprovalRate}%`} sub={`${leaves.length} total requests`} icon={<RewardsIcon sx={{ fontSize: 18 }} />} color="#16A34A" loading={loading} />
        </Grid>
      </Grid>

      {/* Bottom row */}
      <Grid container spacing={2.5} alignItems="stretch">
        {/* Pending actions */}
        <Grid item xs={12} lg={6} sx={{ display: "flex" }}>
          <Card sx={{ width: "100%", display: "flex", flexDirection: "column", minHeight: 480 }}>
            <CardContent sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column", minHeight: 480 }}>
              <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
                    Pending Actions
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8", mt: 0.2 }}>
                    Items waiting for review
                  </Typography>
                </Box>
                {pendingItems.length > 0 && (
                  <Chip
                    label={pendingItems.length}
                    size="small"
                    sx={{ bgcolor: "#FEF3C7", color: "#D97706", fontWeight: 700, fontSize: "0.75rem", height: 22 }}
                  />
                )}
              </Box>
              <Divider />
              {loading ? (
                <Box sx={{ p: 2.5 }}>
                  {[1, 2, 3].map((i) => (
                    <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 2, alignItems: "center" }}>
                      <Skeleton variant="circular" width={34} height={34} />
                      <Box sx={{ flex: 1 }}><Skeleton variant="text" width="65%" /><Skeleton variant="text" width="40%" /></Box>
                    </Box>
                  ))}
                </Box>
              ) : pendingItems.length === 0 ? (
                <Box sx={{ py: 5, textAlign: "center" }}>
                  <CheckIcon sx={{ fontSize: 36, color: "#16A34A", mb: 1 }} />
                  <Typography sx={{ color: "#64748B", fontSize: "0.875rem", fontWeight: 500 }}>
                    All caught up!
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {pendingItems.map((item, i) => (
                    <Box key={i}>
                      <ListItem
                        sx={{ px: 2.5, py: 1.4, "&:hover": { bgcolor: "#F8FAFC" } }}
                        secondaryAction={
                          <Chip
                            label={item.chip}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.68rem",
                              fontWeight: 600,
                              bgcolor: item.color + "15",
                              color: item.color,
                            }}
                          />
                        }
                      >
                        <ListItemAvatar sx={{ minWidth: 44 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: item.color + "15",
                              color: item.color,
                              fontSize: "0.75rem",
                              fontWeight: 700,
                            }}
                          >
                            {item.label.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography sx={{ fontSize: "0.84rem", fontWeight: 600, color: "#0F172A" }}>{item.label}</Typography>}
                          secondary={<Typography sx={{ fontSize: "0.74rem", color: "#94A3B8" }}>{item.sub}</Typography>}
                        />
                      </ListItem>
                      {i < pendingItems.length - 1 && <Divider sx={{ mx: 2 }} />}
                    </Box>
                  ))}
                </List>
              )}
              {pendingItems.length > 0 && (
                <>
                  <Divider />
                  <Box sx={{ px: 2.5, py: 1.25 }}>
                    <Button
                      size="small"
                      endIcon={<ArrowIcon fontSize="small" />}
                      onClick={() => navigate("/mentor/leaves")}
                      sx={{ textTransform: "none", fontWeight: 600, color: "#4F46E5", fontSize: "0.8rem", p: 0 }}
                    >
                      View all leave requests
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Students */}
        <Grid item xs={12} lg={6} sx={{ display: "flex" }}>
          <Card sx={{ width: "100%", display: "flex", flexDirection: "column", minHeight: 480 }}>
            <CardContent sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column", minHeight: 480 }}>
              <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
                    Students
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8", mt: 0.2 }}>
                    {students.length} assigned
                  </Typography>
                </Box>
                <Button
                  size="small"
                  endIcon={<ArrowIcon fontSize="small" />}
                  onClick={() => navigate("/mentor/students")}
                  sx={{ textTransform: "none", fontWeight: 600, color: "#4F46E5", fontSize: "0.8rem" }}
                >
                  View all
                </Button>
              </Box>
              <Divider />
              {loading ? (
                <Box sx={{ p: 2.5 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 2, alignItems: "center" }}>
                      <Skeleton variant="circular" width={34} height={34} />
                      <Box sx={{ flex: 1 }}><Skeleton variant="text" width="60%" /><Skeleton variant="text" width="35%" /></Box>
                    </Box>
                  ))}
                </Box>
              ) : students.length === 0 ? (
                <Box sx={{ py: 5, textAlign: "center" }}>
                  <GroupIcon sx={{ fontSize: 36, color: "#CBD5E1", mb: 1 }} />
                  <Typography sx={{ color: "#64748B", fontSize: "0.875rem", fontWeight: 500 }}>
                    No students assigned yet
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {students.slice(0, 5).map((s, i) => (
                    <Box key={s._id || i}>
                      <ListItem
                        sx={{ px: 2.5, py: 1.3, cursor: "pointer", "&:hover": { bgcolor: "#F8FAFC" } }}
                        onClick={() => navigate("/mentor/students")}
                        secondaryAction={
                          <Chip
                            label={`Yr ${s.year || "?"}`}
                            size="small"
                            sx={{ height: 20, fontSize: "0.68rem", fontWeight: 600, bgcolor: "#EEF2FF", color: "#4F46E5" }}
                          />
                        }
                      >
                        <ListItemAvatar sx={{ minWidth: 44 }}>
                          <Avatar
                            sx={{ width: 32, height: 32, bgcolor: avatarColor(s.name), fontSize: "0.75rem", fontWeight: 700 }}
                          >
                            {initials(s.name)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography sx={{ fontSize: "0.84rem", fontWeight: 600, color: "#0F172A" }}>{s.name}</Typography>}
                          secondary={<Typography sx={{ fontSize: "0.74rem", color: "#94A3B8" }}>{s.department || "—"}</Typography>}
                        />
                      </ListItem>
                      {i < Math.min(students.length, 5) - 1 && <Divider sx={{ mx: 2 }} />}
                    </Box>
                  ))}
                </List>
              )}
              {/* Leave approval progress */}
              {!loading && leaves.length > 0 && (
                <>
                  <Divider />
                  <Box sx={{ px: 2.5, py: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748B" }}>
                        Leave approval rate
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#4F46E5" }}>
                        {leaveApprovalRate}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={leaveApprovalRate}
                      sx={{
                        height: 5,
                        borderRadius: 99,
                        bgcolor: "#EEF2FF",
                        "& .MuiLinearProgress-bar": { bgcolor: "#4F46E5", borderRadius: 99 },
                      }}
                    />
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
