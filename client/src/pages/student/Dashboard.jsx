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
    <Card>
      <CardContent sx={{ p: 2.5 }}>
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
          api.get("/rewardpoints"),
          api.get("/leaverequests"),
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
  const approvedLeaves = leaves.filter((l) => l.status === "approved");

  const usedDays = approvedLeaves.reduce((acc, l) => {
    const diffDays = Math.ceil(Math.abs(new Date(l.toDate) - new Date(l.fromDate)) / 86400000) + 1;
    return acc + diffDays;
  }, 0);

  const attendance   = profile?.attendance ?? 75;
  const totalAllowed = profile?.totalLeaves || 15;
  // Use the server-computed attendance-based quota
  const leaveQuota   = profile?.attendanceBasedLeaveQuota ?? totalAllowed;
  const remaining    = Math.max(0, leaveQuota - usedDays);
  const pct          = leaveQuota > 0 ? Math.round((remaining / leaveQuota) * 100) : 0;

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
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            icon={<TrophyIcon sx={{ fontSize: 18 }} />}
            label="Reward Points"
            value={totalPoints}
            sub={`${Math.max(0, 1000 - totalPoints)} pts to next level`}
            iconColor="#D97706"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            icon={<LeaveIcon sx={{ fontSize: 18 }} />}
            label="Leave Quota"
            value={`${remaining}/${leaveQuota}`}
            sub={`Based on ${attendance}% attendance`}
            iconColor="#4F46E5"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          {/* Attendance card */}
          <Card>
            <CardContent sx={{ p: 2.5 }}>
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
        <Grid item xs={12} sm={6} lg={3}>
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
      <Grid container spacing={2.5}>
        {/* Leave balance */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
                <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
                  Leave Balance
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: tier.color, mt: 0.2, fontWeight: 600 }}>
                  Quota based on attendance ({tier.label})
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ px: 2.5, py: 2.5 }}>
                {/* Balance bar */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>
                      Days remaining
                    </Typography>
                    <Typography sx={{ fontSize: "0.7rem", color: "#94A3B8" }}>
                      Attendance {attendance}% → {leaveQuota}d quota (of {totalAllowed}d max)
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#4F46E5" }}>
                    {remaining} / {leaveQuota}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 6,
                    borderRadius: 99,
                    bgcolor: "#E0E7FF",
                    mb: 1.5,
                    "& .MuiLinearProgress-bar": { bgcolor: tier.color, borderRadius: 99 },
                  }}
                />
                {/* Tier rule note */}
                <Box sx={{ mb: 2, p: 1.25, borderRadius: "7px", bgcolor: tier.bg, border: `1px solid ${tier.color}33` }}>
                  <Typography sx={{ fontSize: "0.7rem", color: tier.color, fontWeight: 700, mb: 0.2 }}>
                    {tier.label} Attendance ({attendance}%)
                  </Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "#64748B" }}>
                    ≥90% → {totalAllowed}d &nbsp;·&nbsp; ≥75% → {Math.floor(totalAllowed * 0.8)}d &nbsp;·&nbsp; ≥60% → {Math.floor(totalAllowed * 0.5)}d &nbsp;·&nbsp; &lt;60% → {Math.floor(totalAllowed * 0.25)}d
                  </Typography>
                </Box>

                {/* Leave stats */}
                <Grid container spacing={1.5}>
                  {[{ label: "Total Allowed", value: totalAllowed, color: "#64748B" },
                    { label: "Quota (Att.)", value: leaveQuota, color: tier.color },
                    { label: "Used", value: usedDays, color: "#D97706" },
                    { label: "Remaining", value: remaining, color: "#16A34A" },
                    { label: "Pending", value: pendingLeaves, color: "#4F46E5" },
                    { label: "Attendance", value: `${attendance}%`, color: tier.color },
                  ].map((s) => (
                    <Grid item xs={6} key={s.label}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: "7px",
                          bgcolor: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: s.color }}>
                          {s.value}
                        </Typography>
                        <Typography sx={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                          {s.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider />
              <Box sx={{ px: 2.5, py: 1.25 }}>
                <Button
                  size="small"
                  endIcon={<ArrowIcon fontSize="small" />}
                  onClick={() => navigate("/student/apply-leave")}
                  sx={{ textTransform: "none", fontWeight: 600, color: "#4F46E5", fontSize: "0.8rem", p: 0 }}
                >
                  Apply for leave
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent leaves + placement status */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={2.5} direction="column">
            {/* Recent leaves */}
            <Grid item>
              <Card>
                <CardContent sx={{ p: 0 }}>
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
            <Grid item>
              <Card>
                <CardContent sx={{ px: 2.5, py: 2 }}>
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
        </Grid>
      </Grid>
    </Box>
  );
}