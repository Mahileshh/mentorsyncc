import { useEffect, useState } from "react";
import {
  Typography, Box, Card, CardContent, Avatar, Chip, Button,
  TextField, Divider, Skeleton, Snackbar, Alert, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemAvatar, ListItemText, LinearProgress,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Add as AddIcon,
  WorkspacePremium as MedalIcon,
} from "@mui/icons-material";
import api from "../../services/api";

const AVATAR_COLORS = ["#4F46E5", "#0EA5E9", "#16A34A", "#D97706", "#DC2626", "#7C3AED"];
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const initials    = (name = "") => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);



export default function RewardPoints() {
  const [students, setStudents]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [dialog,   setDialog]     = useState({ open: false, student: null });
  const [form,     setForm]       = useState({ description: "", points: "" });
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar]   = useState({ open: false, message: "", severity: "success" });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/mentor/mentorstudents");
      // Enrich with reward totals
      const enriched = await Promise.all(
        res.data.map(async (s) => {
          try {
            const r = await api.get(`/mentor/students/${s._id}/rewards`);
            const total = r.data.reduce((acc, rw) => acc + rw.points, 0);
            return { ...s, rewardTotal: total, rewardHistory: r.data };
          } catch {
            return { ...s, rewardTotal: 0, rewardHistory: [] };
          }
        })
      );
      // Sort by total descending (leaderboard feel)
      enriched.sort((a, b) => b.rewardTotal - a.rewardTotal);
      setStudents(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const openDialog = (student) => {
    setForm({ description: "", points: "" });
    setDialog({ open: true, student });
  };
  const closeDialog = () => setDialog({ open: false, student: null });

  const handleAward = async () => {
    if (!form.description.trim() || !form.points) {
      setSnackbar({ open: true, message: "Fill in both description and points", severity: "warning" });
      return;
    }
    const pts = parseInt(form.points, 10);
    if (isNaN(pts) || pts <= 0) {
      setSnackbar({ open: true, message: "Points must be a positive number", severity: "warning" });
      return;
    }
    try {
      setSubmitting(true);
      await api.post(`/mentor/students/${dialog.student._id}/rewards`, {
        description: form.description.trim(),
        points: pts,
      });
      setSnackbar({ open: true, message: `+${pts} pts awarded to ${dialog.student.name}!`, severity: "success" });
      closeDialog();
      fetchStudents(); // refresh totals
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to award points", severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: "#0F172A", letterSpacing: "-0.02em" }}>
          Reward Points
        </Typography>
        <Typography sx={{ color: "#64748B", fontSize: "0.865rem", mt: 0.25 }}>
          Recognise student achievements — award points that students can track in real time.
        </Typography>
      </Box>

      {/* Student list */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>Leaderboard</Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8", mt: 0.2 }}>Students ranked by total points</Typography>
            </Box>
            <TrophyIcon sx={{ color: "#D97706", fontSize: 22 }} />
          </Box>
          <Divider />

          {loading ? (
            <Box sx={{ p: 2.5 }}>
              {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 2, alignItems: "center" }}>
                  <Skeleton variant="circular" width={36} height={36} />
                  <Box sx={{ flex: 1 }}><Skeleton variant="text" width="55%" /><Skeleton variant="text" width="30%" /></Box>
                  <Skeleton variant="rounded" width={90} height={28} />
                </Box>
              ))}
            </Box>
          ) : students.length === 0 ? (
            <Box sx={{ py: 5, textAlign: "center" }}>
              <TrophyIcon sx={{ fontSize: 40, color: "#E2E8F0", mb: 1 }} />
              <Typography sx={{ color: "#94A3B8", fontSize: "0.875rem" }}>No students assigned yet</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {students.map((s, index) => {
                return (
                  <Box key={s._id}>
                    <ListItem
                      sx={{ px: 2.5, py: 1.5, "&:hover": { bgcolor: "#F8FAFC" } }}
                      secondaryAction={
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => openDialog(s)}
                          sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.78rem", borderRadius: 2 }}
                        >
                          Award
                        </Button>
                      }
                    >
                      <ListItemAvatar sx={{ minWidth: 44 }}>
                        <Box sx={{ position: "relative" }}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: avatarColor(s.name), fontSize: "0.78rem", fontWeight: 700 }}>
                            {initials(s.name)}
                          </Avatar>
                          {index < 3 && (
                            <Box sx={{
                              position: "absolute", bottom: -2, right: -2,
                              width: 14, height: 14, borderRadius: "50%",
                              bgcolor: index === 0 ? "#D97706" : index === 1 ? "#64748B" : "#CD7F32",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "0.5rem", color: "#fff", fontWeight: 800
                            }}>
                              {index + 1}
                            </Box>
                          )}
                        </Box>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography sx={{ fontSize: "0.84rem", fontWeight: 600, color: "#0F172A" }}>{s.name}</Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.25 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <TrophyIcon sx={{ fontSize: 12, color: "#D97706" }} />
                              <Typography sx={{ fontSize: "0.73rem", fontWeight: 700, color: "#D97706" }}>
                                {s.rewardTotal} pts
                              </Typography>
                              <Typography sx={{ fontSize: "0.73rem", color: "#94A3B8" }}>
                                · {s.rewardHistory.length} {s.rewardHistory.length === 1 ? "entry" : "entries"}
                              </Typography>
                            </Box>
                            {s.rewardTotal > 0 && (
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.min(100, (s.rewardTotal % 500) / 5)}
                                  sx={{ mt: 0.5, height: 3, borderRadius: 99, bgcolor: "#EEF2FF", width: 100,
                                    "& .MuiLinearProgress-bar": { bgcolor: "#4F46E5", borderRadius: 99 } }}
                                />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < students.length - 1 && <Divider sx={{ mx: 2 }} />}
                  </Box>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Award Dialog */}
      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem", borderBottom: "1px solid #F1F5F9", pb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MedalIcon sx={{ color: "#D97706" }} />
            Award Points — {dialog.student?.name}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                placeholder="e.g. Outstanding project submission"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                size="small"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Points"
                type="number"
                inputProps={{ min: 1, max: 500 }}
                placeholder="e.g. 50"
                value={form.points}
                onChange={(e) => setForm({ ...form, points: e.target.value })}
                size="small"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>

          {/* Quick presets */}
          <Box sx={{ mt: 1.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {[10, 25, 50, 100].map((p) => (
              <Chip
                key={p}
                label={`+${p}`}
                size="small"
                onClick={() => setForm({ ...form, points: String(p) })}
                sx={{
                  cursor: "pointer", fontWeight: 600, fontSize: "0.73rem",
                  bgcolor: form.points === String(p) ? "#EEF2FF" : "#F8FAFC",
                  color: form.points === String(p) ? "#4F46E5" : "#64748B",
                  border: `1px solid ${form.points === String(p) ? "#4F46E5" : "#E2E8F0"}`,
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2, borderTop: "1px solid #F1F5F9", pt: 1.5 }}>
          <Button onClick={closeDialog} sx={{ textTransform: "none", color: "#64748B" }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAward}
            disabled={submitting}
            startIcon={<TrophyIcon />}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
          >
            {submitting ? "Awarding…" : "Award Points"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
