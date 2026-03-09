import { useState, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Divider, Alert, Snackbar, Chip, InputAdornment, Grid,
  Table, TableHead, TableRow, TableCell, TableBody,
  Avatar, Skeleton, Tabs, Tab,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Work as WorkIcon,
  CurrencyRupee as RupeeIcon,
  Link as LinkIcon,
  Send as SendIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  AccessTime as PendingIcon,
  Add as AddIcon,
  Description as DocIcon,
} from "@mui/icons-material";
import api from "../../services/api";

/* ── status config ── */
const STATUS = {
  "Pending Mentor": { label: "Pending Review", color: "#D97706", bg: "#FFFBEB", icon: <PendingIcon sx={{ fontSize: 13 }} /> },
  "Mentor Verified": { label: "Approved",       color: "#16A34A", bg: "#F0FDF4", icon: <CheckIcon  sx={{ fontSize: 13 }} /> },
  "Rejected":        { label: "Rejected",        color: "#DC2626", bg: "#FEF2F2", icon: <CancelIcon sx={{ fontSize: 13 }} /> },
};

const INITIAL = { company: "", role: "", package: "", offerLetterUrl: "", remarks: "" };

export default function PlacementRequest() {
  const [tab,       setTab]       = useState(0);
  const [form,      setForm]      = useState(INITIAL);
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [records,   setRecords]   = useState([]);
  const [fetching,  setFetching]  = useState(true);
  const [snack,     setSnack]     = useState({ open: false, msg: "", sev: "success" });

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try {
      setFetching(true);
      const res = await api.get("/student/my-placements");
      setRecords(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.company.trim())  e.company  = "Company name is required.";
    if (!form.role.trim())     e.role     = "Job role is required.";
    if (!form.package.trim())  e.package  = "Package is required.";
    if (form.offerLetterUrl && !/^https?:\/\//i.test(form.offerLetterUrl))
      e.offerLetterUrl = "Must be a valid URL starting with http(s)://";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    setLoading(true);
    try {
      await api.post("/student/submit-placement", form);
      setSnack({ open: true, msg: "Placement submitted successfully!", sev: "success" });
      setForm(INITIAL);
      setErrors({});
      await fetchRecords();
      setTab(1);
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || "Submission failed.", sev: "error" });
    } finally {
      setLoading(false);
    }
  };

  const latestApproved = records.find((r) => r.status === "Mentor Verified");

  return (
    <Box sx={{ maxWidth: 860 }}>
      {/* Header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: "#0F172A", letterSpacing: "-0.02em" }}>
          Placement Request
        </Typography>
        <Typography sx={{ color: "#64748B", fontSize: "0.865rem", mt: 0.25 }}>
          Submit your placement details and track your approval status.
        </Typography>
      </Box>

      {/* Summary banner if approved */}
      {latestApproved && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: "8px",
            bgcolor: "#F0FDF4",
            border: "1px solid #BBF7D0",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <CheckIcon sx={{ color: "#16A34A", fontSize: 20 }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#15803D" }}>
              Placement Verified!
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "#16A34A" }}>
              {latestApproved.company} · {latestApproved.role} · {latestApproved.package} LPA
            </Typography>
          </Box>
        </Box>
      )}

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 2.5,
          "& .MuiTabs-indicator": { bgcolor: "#4F46E5" },
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.875rem", color: "#64748B" },
          "& .Mui-selected": { color: "#4F46E5 !important" },
        }}
      >
        <Tab icon={<AddIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="New Request" />
        <Tab icon={<DocIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={`My Submissions (${records.length})`} />
      </Tabs>

      {/* ── Tab 0: Submit Form ── */}
      {tab === 0 && (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 34, height: 34, borderRadius: "8px", bgcolor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <WorkIcon sx={{ fontSize: 17, color: "#4F46E5" }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.92rem" }}>Placement Details</Typography>
                <Typography sx={{ fontSize: "0.73rem", color: "#94A3B8" }}>All fields marked * are required</Typography>
              </Box>
            </Box>
            <Divider />

            <Box component="form" onSubmit={handleSubmit} sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
              <Grid container spacing={2}>
                {/* Company */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", mb: 0.75 }}>
                      Company Name *
                    </Typography>
                    <TextField
                      fullWidth size="small"
                      placeholder="e.g. Infosys, TCS, Amazon"
                      value={form.company}
                      onChange={handleChange("company")}
                      error={!!errors.company}
                      helperText={errors.company}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><BusinessIcon sx={{ fontSize: 16, color: "#94A3B8" }} /></InputAdornment>,
                      }}
                    />
                  </Box>
                </Grid>

                {/* Role */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", mb: 0.75 }}>
                      Job Role *
                    </Typography>
                    <TextField
                      fullWidth size="small"
                      placeholder="e.g. Software Engineer, Analyst"
                      value={form.role}
                      onChange={handleChange("role")}
                      error={!!errors.role}
                      helperText={errors.role}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><WorkIcon sx={{ fontSize: 16, color: "#94A3B8" }} /></InputAdornment>,
                      }}
                    />
                  </Box>
                </Grid>

                {/* Package */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", mb: 0.75 }}>
                      Package (LPA) *
                    </Typography>
                    <TextField
                      fullWidth size="small"
                      placeholder="e.g. 6.5"
                      value={form.package}
                      onChange={handleChange("package")}
                      error={!!errors.package}
                      helperText={errors.package}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><RupeeIcon sx={{ fontSize: 16, color: "#94A3B8" }} /></InputAdornment>,
                        endAdornment: <InputAdornment position="end"><Typography sx={{ fontSize: "0.75rem", color: "#94A3B8" }}>LPA</Typography></InputAdornment>,
                      }}
                    />
                  </Box>
                </Grid>

                {/* Offer letter URL */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", mb: 0.75 }}>
                      Offer Letter URL <Typography component="span" sx={{ fontWeight: 400, color: "#94A3B8", fontSize: "0.75rem" }}>(optional)</Typography>
                    </Typography>
                    <TextField
                      fullWidth size="small"
                      placeholder="https://drive.google.com/..."
                      value={form.offerLetterUrl}
                      onChange={handleChange("offerLetterUrl")}
                      error={!!errors.offerLetterUrl}
                      helperText={errors.offerLetterUrl}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LinkIcon sx={{ fontSize: 16, color: "#94A3B8" }} /></InputAdornment>,
                      }}
                    />
                  </Box>
                </Grid>

                {/* Remarks */}
                <Grid item xs={12}>
                  <Box>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", mb: 0.75 }}>
                      Additional Remarks <Typography component="span" sx={{ fontWeight: 400, color: "#94A3B8", fontSize: "0.75rem" }}>(optional)</Typography>
                    </Typography>
                    <TextField
                      fullWidth size="small" multiline rows={2}
                      placeholder="Any additional context about the placement…"
                      value={form.remarks}
                      onChange={handleChange("remarks")}
                    />
                  </Box>
                </Grid>

                {/* Notice */}
                <Grid item xs={12}>
                  <Box sx={{ p: 1.5, borderRadius: "7px", bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <Typography sx={{ fontSize: "0.775rem", color: "#64748B", lineHeight: 1.6 }}>
                      After submission your request will appear as <strong>Pending Review</strong>. Your mentor will verify the details and update the status to <strong>Approved</strong> or <strong>Rejected</strong>.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    endIcon={<SendIcon fontSize="small" />}
                    sx={{ py: 1.1, px: 3, bgcolor: "#4F46E5", "&:hover": { bgcolor: "#4338CA" }, borderRadius: "6px" }}
                  >
                    {loading ? "Submitting…" : "Submit Placement Request"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ── Tab 1: Submissions Table ── */}
      {tab === 1 && (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
              <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>My Submissions</Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8", mt: 0.2 }}>Track the status of all your placement requests</Typography>
            </Box>
            <Divider />

            {fetching ? (
              <Box sx={{ p: 2.5 }}>
                {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={52} sx={{ mb: 1, borderRadius: "6px" }} />)}
              </Box>
            ) : records.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <WorkIcon sx={{ fontSize: 40, color: "#E2E8F0", mb: 1 }} />
                <Typography sx={{ color: "#94A3B8", fontSize: "0.875rem" }}>No submissions yet.</Typography>
                <Button
                  size="small"
                  onClick={() => setTab(0)}
                  sx={{ mt: 1.5, textTransform: "none", color: "#4F46E5", fontWeight: 600, fontSize: "0.82rem" }}
                >
                  Submit your first request →
                </Button>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Package</TableCell>
                    <TableCell>Submitted On</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Offer Letter</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((r) => {
                    const s = STATUS[r.status] ?? STATUS["Pending Mentor"];
                    return (
                      <TableRow key={r._id} sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: "#EEF2FF", color: "#4F46E5", fontSize: "0.7rem", fontWeight: 700, borderRadius: "6px" }}>
                              {r.company?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <Typography sx={{ fontWeight: 600, fontSize: "0.855rem" }}>{r.company}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: "#64748B", fontSize: "0.84rem" }}>{r.role || "—"}</TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 600, fontSize: "0.84rem", color: "#0F172A" }}>
                            {r.package} <Typography component="span" sx={{ fontWeight: 400, color: "#94A3B8", fontSize: "0.72rem" }}>LPA</Typography>
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: "#64748B", fontSize: "0.8rem" }}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={s.icon}
                            label={s.label}
                            size="small"
                            sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: "0.72rem", height: 22, "& .MuiChip-icon": { color: "inherit", ml: "6px" } }}
                          />
                          {r.status === "Rejected" && r.rejectionReason && (
                            <Typography sx={{ fontSize: "0.7rem", color: "#DC2626", mt: 0.5 }}>
                              Reason: {r.rejectionReason}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {r.offerLetterUrl ? (
                            <Button
                              size="small"
                              variant="outlined"
                              href={r.offerLetterUrl}
                              target="_blank"
                              startIcon={<LinkIcon sx={{ fontSize: 13 }} />}
                              sx={{ textTransform: "none", fontSize: "0.75rem", borderColor: "#E2E8F0", color: "#4F46E5", borderRadius: "5px", py: 0.3, px: 1 }}
                            >
                              View
                            </Button>
                          ) : (
                            <Typography sx={{ color: "#CBD5E1", fontSize: "0.8rem" }}>—</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.sev} variant="filled" sx={{ borderRadius: "8px" }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
