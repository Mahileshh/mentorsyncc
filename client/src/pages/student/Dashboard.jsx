import { useEffect, useState } from "react";
import {
  Grid, Card, CardContent, Typography, Box,
  Avatar, Chip, Divider, CircularProgress,
  Alert, LinearProgress, List, ListItem,
  ListItemText, Button, Tooltip,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  BeachAccess as LeaveIcon,
  Work as PlacementIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
  Cancel as CancelIcon,
  School as AttendanceIcon,
  Info as InfoIcon,
  Book as BookIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const STATUS_MAP = {
  approved: { label: "Approved", color: "#16A34A", bg: "#F0FDF4" },
  pending:  { label: "Pending",  color: "#D97706", bg: "#FFFBEB" },
  rejected: { label: "Rejected", color: "#DC2626", bg: "#FEF2F2" },
};

function KpiCard({ icon, label, value, sub, iconColor }) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", flex: 1, width: "100%" }}>
      <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: "1.9rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em", lineHeight: 1 }}>
              {value}
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#64748B", mt: 0.5 }}>
              {label}
            </Typography>
          </Box>
          <Avatar sx={{ width: 38, height: 38, bgcolor: iconColor + "18", color: iconColor, borderRadius: "8px" }}>
            {icon}
          </Avatar>
        </Box>
        {sub && <Typography sx={{ fontSize: "0.73rem", color: "#94A3B8" }}>{sub}</Typography>}
      </CardContent>
    </Card>
  );
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [r, l, p, prof] = await Promise.all([
          api.get("/student/my-rewards"),
          api.get("/student/my-leaves"),
          api.get("/student/my-placements"),
          api.get("/student/profile"),
        ]);
        setRewards(r.data);
        setLeaves(l.data);
        setPlacements(p.data);
        setProfile(prof.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPoints   = rewards.reduce((a, r) => a + r.points, 0);
  const pendingLeaves = leaves.filter((l) => l.status === "pending").length;
  const attendance   = profile?.attendance ?? 75;

  // Attendance tier display
  const getAttendanceTier = (pct) => {
    if (pct >= 90) return { label: "Excellent", color: "#16A34A", bg: "#F0FDF4" };
    if (pct >= 75) return { label: "Good",      color: "#4F46E5", bg: "#EEF2FF" };
    if (pct >= 60) return { label: "Low",       color: "#D97706", bg: "#FFFBEB" };
    return              { label: "Critical",  color: "#DC2626", bg: "#FEF2F2" };
  };
  const tier = getAttendanceTier(attendance);

  const latestPlacement = placements[placements.length - 1] ?? null;
  const plStatus = STATUS_MAP[latestPlacement?.status?.toLowerCase()] ?? STATUS_MAP.pending;

  const recentLeaves = [...leaves].reverse().slice(0, 4);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={32} sx={{ color: "#4F46E5" }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: "#0F172A", letterSpacing: "-0.02em" }}>
          Overview
        </Typography>
        <Typography sx={{ color: "#64748B", fontSize: "0.865rem", mt: 0.25 }}>
          Your leave, placement, and reward summary at a glance.
        </Typography>
      </Box>

      {/* KPI row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }} alignItems="stretch">
        <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
          <KpiCard
            icon={<TrophyIcon sx={{ fontSize: 18 }} />}
            label="Reward Points"
            value={totalPoints}
            sub={`${Math.max(0, 1000 - totalPoints)} pts to next level`}
            iconColor="#D97706"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
          {/* Attendance card */}
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column", flex: 1, width: "100%" }}>
            <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: "1.9rem", fontWeight: 800, color: tier.color, letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {attendance}%
                  </Typography>
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#64748B", mt: 0.5 }}>Attendance</Typography>
                </Box>
                <Avatar sx={{ width: 38, height: 38, bgcolor: tier.bg, color: tier.color, borderRadius: "8px" }}>
                  <AttendanceIcon sx={{ fontSize: 18 }} />
                </Avatar>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(attendance, 100)}
                sx={{
                  height: 4, borderRadius: 99, bgcolor: tier.bg,
                  "& .MuiLinearProgress-bar": { bgcolor: tier.color, borderRadius: 99 },
                  mb: 1,
                }}
              />
              <Chip
                label={tier.label}
                size="small"
                sx={{ bgcolor: tier.bg, color: tier.color, fontWeight: 700, fontSize: "0.68rem", height: 20 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
          <KpiCard
            icon={<PlacementIcon sx={{ fontSize: 18 }} />}
            label="Placement"
            value={latestPlacement ? latestPlacement.status ?? "Submitted" : "None"}
            sub={latestPlacement?.company || latestPlacement?.companyName || "No active request"}
            iconColor="#0EA5E9"
          />
        </Grid>
      </Grid>

      {/* Details row */}
      <Grid container spacing={2.5} alignItems="stretch">

        {/* Current Subjects List */}
        <Grid item xs={12} md={5} sx={{ display: "flex" }}>
          <Card sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column" }}>
              <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
                    Current Subjects
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8", mt: 0.2 }}>
                    Your enrolled department courses
                  </Typography>
                </Box>
                <Button
                  size="small"
                  endIcon={<ArrowIcon fontSize="small" />}
                  onClick={() => navigate("/student/exemptions")}
                  sx={{ textTransform: "none", fontWeight: 600, color: "#4F46E5", fontSize: "0.8rem" }}
                >
                  Manage
                </Button>
              </Box>
              <Divider />
              {(!profile?.enrolledCourses || profile?.enrolledCourses?.length === 0) ? (
                <Box sx={{ py: 3, textAlign: "center" }}>
                  <Typography sx={{ color: "#94A3B8", fontSize: "0.855rem" }}>No courses found</Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {profile.enrolledCourses.map((course, i) => (
                    <Box key={course._id || course.name}>
                      <ListItem sx={{ px: 2.5, py: 1.5 }}>
                        <Avatar sx={{ bgcolor: course.status === "Exempted" ? "#F0FDF4" : "#EEF2FF", color: course.status === "Exempted" ? "#16A34A" : "#4F46E5", width: 32, height: 32, mr: 2 }}>
                          <BookIcon sx={{ fontSize: 16 }} />
                        </Avatar>
                        <ListItemText
                          primary={course.name}
                          primaryTypographyProps={{
                            color: course.status === "Exempted" ? "text.secondary" : "#0F172A",
                            sx: { 
                              fontSize: "0.84rem", 
                              fontWeight: 600,
                              textDecoration: course.status === "Exempted" ? "line-through" : "none" 
                            }
                          }}
                        />
                        <Chip
                          label={
                            course.status === "Enrolled" ? "Enrolled" :
                            course.status === "Pending" ? "Pending Exemption" :
                            "Course Exempted"
                          }
                          size="small"
                          sx={{
                            height: 20, fontSize: "0.68rem", fontWeight: 600,
                            bgcolor: course.status === "Exempted" ? "#F0FDF4" : course.status === "Pending" ? "#FFFBEB" : "#EEF2FF",
                            color: course.status === "Exempted" ? "#16A34A" : course.status === "Pending" ? "#D97706" : "#4F46E5",
                            border: course.status === "Enrolled" ? "1px solid #E2E8F0" : "none"
                          }}
                        />
                      </ListItem>
                      {i < profile.enrolledCourses.length - 1 && <Divider sx={{ mx: 2 }} />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent leaves */}
        <Grid item xs={12} md={4} sx={{ display: "flex" }}>
          <Card sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
                        Recent Leaves
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8", mt: 0.2 }}>
                        Your latest requests
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      endIcon={<ArrowIcon fontSize="small" />}
                      onClick={() => navigate("/student/leave-history")}
                      sx={{ textTransform: "none", fontWeight: 600, color: "#4F46E5", fontSize: "0.8rem" }}
                    >
                      History
                    </Button>
                  </Box>
                  <Divider />
                  {recentLeaves.length === 0 ? (
                    <Box sx={{ py: 3, textAlign: "center" }}>
                      <Typography sx={{ color: "#94A3B8", fontSize: "0.855rem" }}>No leave requests yet</Typography>
                    </Box>
                  ) : (
                    <List disablePadding>
                      {recentLeaves.map((l, i) => {
                        const st = STATUS_MAP[l.status?.toLowerCase()] ?? STATUS_MAP.pending;
                        return (
                          <Box key={l._id || i}>
                            <ListItem
                              sx={{ px: 2.5, py: 1.2 }}
                              secondaryAction={
                                <Chip
                                  label={st.label}
                                  size="small"
                                  sx={{ height: 20, fontSize: "0.68rem", fontWeight: 600, bgcolor: st.bg, color: st.color }}
                                />
                              }
                            >
                              <ListItemText
                                primary={<Typography sx={{ fontSize: "0.84rem", fontWeight: 600, color: "#0F172A" }}>{l.reason?.slice(0, 50) || "Leave request"}</Typography>}
                                secondary={
                                  <Typography sx={{ fontSize: "0.73rem", color: "#94A3B8" }}>
                                    {l.fromDate ? new Date(l.fromDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                                    {" → "}
                                    {l.toDate ? new Date(l.toDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                  </Typography>
                                }
                              />
                            </ListItem>
                            {i < recentLeaves.length - 1 && <Divider sx={{ mx: 2 }} />}
                          </Box>
                        );
                      })}
                    </List>
                  )}
                </CardContent>
              </Card>
        </Grid>

        {/* Placement status */}
        <Grid item xs={12} md={3} sx={{ display: "flex" }}>
            <Card sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ px: 2.5, py: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
                        Placement Status
                      </Typography>
                      {latestPlacement ? (
                        <>
                          <Typography sx={{ fontSize: "0.8rem", color: "#64748B", mt: 0.5 }}>
                            {latestPlacement.company || latestPlacement.companyName || "Application submitted"}
                          </Typography>
                          <Chip
                            label={plStatus.label}
                            size="small"
                            sx={{ mt: 1, height: 22, fontSize: "0.73rem", fontWeight: 600, bgcolor: plStatus.bg, color: plStatus.color }}
                          />
                        </>
                      ) : (
                        <Typography sx={{ fontSize: "0.8rem", color: "#94A3B8", mt: 0.5 }}>
                          No placement request submitted
                        </Typography>
                      )}
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate("/student/placement")}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        borderColor: "#E2E8F0",
                        color: "#4F46E5",
                        "&:hover": { borderColor: "#4F46E5" },
                        borderRadius: "6px",
                      }}
                    >
                      {latestPlacement ? "View" : "Apply"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
        </Grid>
      </Grid>
    </Box>
  );
}