import { useEffect, useState } from "react";
import {
  Typography, Box, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody,
  Chip, Divider, Button, Avatar, Skeleton, Snackbar, Alert, Grid, TextField, LinearProgress,
  Select, MenuItem, InputLabel, FormControl, FormHelperText
} from "@mui/material";
import {
  Assignment as ExemptionIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Schedule as PendingIcon
} from "@mui/icons-material";
import api from "../../services/api";

const STATUS_MAP = {
  "Approved": { color: "#16A34A", bg: "#F0FDF4", icon: <CheckIcon fontSize="small" /> },
  "Pending Mentor": { color: "#D97706", bg: "#FFFBEB", icon: <PendingIcon fontSize="small" /> },
  "Rejected": { color: "#DC2626", bg: "#FEF2F2", icon: <CloseIcon fontSize="small" /> }
};

export default function CourseExemptions() {
  const [exemptions, setExemptions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ subjectName: "", reason: "", certificationLink: "", creditCount: "" });
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchExemptions = async () => {
    try {
      const [exRes, profRes] = await Promise.all([
        api.get("/student/my-exemptions"),
        api.get("/student/profile")
      ]);
      setExemptions(exRes.data);
      setCourses(profRes.data.enrolledCourses || []);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to load exemptions", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExemptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subjectName.trim() || !form.reason.trim()) {
      setSnackbar({ open: true, message: "Please fill in all fields", severity: "warning" });
      return;
    }
    try {
      setSubmitting(true);
      await api.post("/student/apply-exemption", { ...form, creditCount: Number(form.creditCount) });
      setSnackbar({ open: true, message: "Exemption request submitted successfully!", severity: "success" });
      setForm({ subjectName: "", reason: "", certificationLink: "", creditCount: "" });
      fetchExemptions();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || "Submit failed", severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ bgcolor: "#4F46E5", width: 42, height: 42, borderRadius: 2 }}>
          <ExemptionIcon />
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: "#0F172A", letterSpacing: "-0.02em" }}>
            Course Exemptions
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: "0.865rem", mt: 0.25 }}>
            Apply to skip subjects based on prior certification or equivalent work.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Application Form */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
                <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
                  New Request
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8", mt: 0.2 }}>
                  Submit supporting details to your mentor
                </Typography>
              </Box>
              <Divider />
              <Box component="form" onSubmit={handleSubmit} sx={{ px: 2.5, py: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Subject Name</InputLabel>
                  <Select
                    value={form.subjectName}
                    label="Subject Name"
                    onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
                    sx={{ borderRadius: 2 }}
                  >
                    {courses.map((course) => (
                      <MenuItem 
                        key={course._id || course.name} 
                        value={course.name}
                        disabled={course.status !== "Enrolled"}
                      >
                        {course.name} {course.status !== "Enrolled" ? `(${course.status})` : ""}
                      </MenuItem>
                    ))}
                    {courses.length === 0 && (
                      <MenuItem disabled value="">No courses available</MenuItem>
                    )}
                  </Select>
                </FormControl>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Credit Count"
                      type="number"
                      placeholder="e.g. 3"
                      value={form.creditCount}
                      onChange={(e) => setForm({ ...form, creditCount: e.target.value })}
                      InputProps={{ sx: { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Certification Link (Optional)"
                      placeholder="https://coursera.org/verify/..."
                      value={form.certificationLink}
                      onChange={(e) => setForm({ ...form, certificationLink: e.target.value })}
                      InputProps={{ sx: { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Reason & Evidence"
                  placeholder="Provide certification links or rationale..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  multiline
                  rows={4}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  sx={{ mt: 1, py: 1, borderRadius: 2, fontWeight: 700, textTransform: "none" }}
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* History Table */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
                <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
                  Exemption History
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8", mt: 0.2 }}>
                  Track your previous applications
                </Typography>
              </Box>
              <Divider />
              
              {loading ? (
                <LinearProgress sx={{ height: 2 }} />
              ) : exemptions.length === 0 ? (
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <ExemptionIcon sx={{ fontSize: 40, color: "#E2E8F0", mb: 1 }} />
                  <Typography sx={{ color: "#94A3B8", fontSize: "0.875rem" }}>
                    No exemptions applied yet
                  </Typography>
                </Box>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow sx={{ "& th": { fontWeight: 600, color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" } }}>
                      <TableCell>Subject</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date Applied</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {exemptions.map((ex) => {
                      const st = STATUS_MAP[ex.status] || STATUS_MAP["Pending Mentor"];
                      return (
                        <TableRow key={ex._id} sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}>
                          <TableCell>
                            <Box>
                              <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#0F172A" }}>
                                {ex.subjectName}
                              </Typography>
                              <Typography sx={{ fontSize: "0.72rem", color: "#64748B", mt: 0.2 }}>
                                {ex.reason.slice(0, 40)}{ex.reason.length > 40 ? "..." : ""}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={st.icon}
                              label={ex.status === "Pending Mentor" ? "Pending" : ex.status}
                              size="small"
                              sx={{
                                bgcolor: st.bg, color: st.color, fontWeight: 700, fontSize: "0.7rem", height: 22,
                                "& .MuiChip-icon": { color: st.color }
                              }}
                            />
                            {ex.status === "Rejected" && ex.rejectionReason && (
                              <Typography sx={{ fontSize: "0.65rem", color: "#DC2626", mt: 0.5, maxWidth: 150, lineHeight: 1.2 }}>
                                {ex.rejectionReason}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ color: "#64748B", fontSize: "0.8rem" }}>
                            {new Date(ex.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
