import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, CardContent, Typography, Chip, Button, Divider,
  Table, TableHead, TableRow, TableCell, TableBody, Avatar,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment, Skeleton, Alert, Grid, IconButton, Tooltip,
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Link as LinkIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import api from "../../services/api";

/* ── status config ── */
const STATUS = {
  "Pending Mentor": { label: "Pending",  color: "#D97706", bg: "#FFFBEB" },
  "Mentor Verified":{ label: "Approved", color: "#16A34A", bg: "#F0FDF4" },
  "Rejected":       { label: "Rejected", color: "#DC2626", bg: "#FEF2F2" },
};

const AVATAR_COLORS = ["#4F46E5", "#0EA5E9", "#16A34A", "#D97706", "#7C3AED", "#DC2626"];
const avatarColor = (n = "") => AVATAR_COLORS[n.charCodeAt(0) % AVATAR_COLORS.length];

/* ── Detail / Action Dialog ── */
function DetailDialog({ open, record, onClose, onAction }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason,    setReason]    = useState("");
  const [busy,      setBusy]      = useState(false);
  const [err,       setErr]       = useState("");

  // Reset local state when dialog opens
  useEffect(() => {
    if (open) { setRejecting(false); setReason(""); setErr(""); }
  }, [open]);

  if (!record) return null;

  const handleApprove = async () => {
    setBusy(true);
    await onAction(record._id, "Mentor Verified", "");
    setBusy(false);
  };

  const handleReject = async () => {
    if (!reason.trim()) { setErr("Please provide a reason for rejection."); return; }
    setBusy(true);
    await onAction(record._id, "Rejected", reason.trim());
    setBusy(false);
  };

  const s = STATUS[record.status] ?? STATUS["Pending Mentor"];
  const isPending = record.status === "Pending Mentor";

  return (
    <Dialog
      open={open}
      onClose={!busy ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "12px" } }}
    >
      <DialogTitle sx={{ px: 3, py: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "1rem" }}>
            Placement Details
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8", mt: 0.2 }}>
            Review and update the status
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} disabled={busy}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {/* Student row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: avatarColor(record.studentName), fontWeight: 700, fontSize: "0.9rem" }}>
            {record.studentName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.9rem" }}>{record.studentName}</Typography>
            {record.studentEmail && (
              <Typography sx={{ fontSize: "0.75rem", color: "#64748B" }}>{record.studentEmail}</Typography>
            )}
          </Box>
          <Chip
            label={s.label}
            size="small"
            sx={{ ml: "auto", bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: "0.72rem", height: 22 }}
          />
        </Box>

        {/* Details grid */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {[
            { label: "Company",  value: record.company },
            { label: "Job Role", value: record.role || "—" },
            { label: "Package",  value: record.package ? `${record.package} LPA` : "—" },
            { label: "Submitted", value: record.createdAt ? new Date(record.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—" },
          ].map((d) => (
            <Grid item xs={6} key={d.label}>
              <Box sx={{ p: 1.5, borderRadius: "7px", bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <Typography sx={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.25 }}>{d.label}</Typography>
                <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#0F172A" }}>{d.value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Offer letter */}
        {record.offerLetterUrl && (
          <Box sx={{ mb: 2, p: 1.5, borderRadius: "7px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LinkIcon sx={{ fontSize: 16, color: "#4F46E5" }} />
              <Typography sx={{ fontSize: "0.82rem", color: "#4F46E5", fontWeight: 600 }}>Offer Letter</Typography>
            </Box>
            <Button
              size="small"
              href={record.offerLetterUrl}
              target="_blank"
              variant="outlined"
              sx={{ textTransform: "none", fontSize: "0.75rem", borderColor: "#E2E8F0", color: "#4F46E5", borderRadius: "5px", py: 0.3, px: 1.25 }}
            >
              Open Document
            </Button>
          </Box>
        )}

        {/* Remarks */}
        {record.remarks && (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600, mb: 0.5 }}>Student Remarks</Typography>
            <Typography sx={{ fontSize: "0.855rem", color: "#374151", p: 1.5, bgcolor: "#F8FAFC", borderRadius: "7px", border: "1px solid #E2E8F0" }}>
              {record.remarks}
            </Typography>
          </Box>
        )}

        {/* Rejection reason (if already rejected) */}
        {record.status === "Rejected" && record.rejectionReason && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.82rem" }}>Rejection Reason</Typography>
            <Typography sx={{ fontSize: "0.82rem" }}>{record.rejectionReason}</Typography>
          </Alert>
        )}

        {/* Reject reason input */}
        {isPending && rejecting && (
          <Box sx={{ mt: 1 }}>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", mb: 0.75 }}>
              Reason for Rejection *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              placeholder="Explain why this placement is being rejected…"
              value={reason}
              onChange={(e) => { setReason(e.target.value); setErr(""); }}
              error={!!err}
              helperText={err}
            />
          </Box>
        )}
      </DialogContent>

      {isPending && (
        <>
          <Divider />
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            {!rejecting ? (
              <>
                <Button
                  onClick={() => setRejecting(true)}
                  disabled={busy}
                  startIcon={<RejectIcon fontSize="small" />}
                  sx={{ textTransform: "none", color: "#DC2626", fontWeight: 600, fontSize: "0.855rem", "&:hover": { bgcolor: "#FEF2F2" } }}
                >
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={busy}
                  variant="contained"
                  startIcon={<ApproveIcon fontSize="small" />}
                  sx={{ textTransform: "none", bgcolor: "#16A34A", "&:hover": { bgcolor: "#15803D" }, borderRadius: "6px", fontWeight: 600 }}
                >
                  {busy ? "Approving…" : "Approve Placement"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => { setRejecting(false); setErr(""); }}
                  disabled={busy}
                  sx={{ textTransform: "none", color: "#64748B", fontWeight: 600, fontSize: "0.855rem" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={busy}
                  variant="contained"
                  startIcon={<RejectIcon fontSize="small" />}
                  sx={{ textTransform: "none", bgcolor: "#DC2626", "&:hover": { bgcolor: "#B91C1C" }, borderRadius: "6px", fontWeight: 600 }}
                >
                  {busy ? "Rejecting…" : "Confirm Rejection"}
                </Button>
              </>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

/* ── Main Page ── */
export default function PlacementRequests() {
  const [placements, setPlacements] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("all");
  const [selected,   setSelected]   = useState(null);
  const [snack,      setSnack]      = useState({ show: false, msg: "", sev: "success" });

  const fetchPlacements = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/mentor/placements");
      setPlacements(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlacements(); }, [fetchPlacements]);

  const handleAction = async (id, status, rejectionReason) => {
    try {
      await api.patch(`/mentor/placements/${id}`, { status, rejectionReason });
      setSnack({ show: true, msg: status === "Mentor Verified" ? "Placement approved!" : "Placement rejected.", sev: status === "Mentor Verified" ? "success" : "warning" });
      setSelected(null);
      await fetchPlacements();
    } catch (e) {
      setSnack({ show: true, msg: "Action failed. Please try again.", sev: "error" });
    }
  };

  // Derived
  const pending  = placements.filter((p) => p.status === "Pending Mentor").length;
  const approved = placements.filter((p) => p.status === "Mentor Verified").length;
  const rejected = placements.filter((p) => p.status === "Rejected").length;

  const visible = placements.filter((p) => {
    const matchFilter = filter === "all" || p.status === filter;
    const matchSearch = !search || [p.studentName, p.company, p.role].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase())
    );
    return matchFilter && matchSearch;
  });

  const FILTER_TABS = [
    { key: "all",            label: `All (${placements.length})` },
    { key: "Pending Mentor", label: `Pending (${pending})` },
    { key: "Mentor Verified",label: `Approved (${approved})` },
    { key: "Rejected",       label: `Rejected (${rejected})` },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3.5, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: "#0F172A", letterSpacing: "-0.02em" }}>
            Placement Requests
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: "0.865rem", mt: 0.25 }}>
            Review and verify student placement submissions.
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={fetchPlacements} sx={{ border: "1px solid #E2E8F0", borderRadius: "7px", p: 0.75 }}>
            <RefreshIcon fontSize="small" sx={{ color: "#64748B" }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stats bar */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Total",    value: placements.length, color: "#4F46E5", bg: "#EEF2FF" },
          { label: "Pending",  value: pending,           color: "#D97706", bg: "#FFFBEB" },
          { label: "Approved", value: approved,          color: "#16A34A", bg: "#F0FDF4" },
          { label: "Rejected", value: rejected,          color: "#DC2626", bg: "#FEF2F2" },
        ].map((s) => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Card sx={{ cursor: "pointer" }} onClick={() => setFilter(s.label === "Total" ? "all" : (s.label === "Pending" ? "Pending Mentor" : s.label === "Approved" ? "Mentor Verified" : "Rejected"))}>
              <CardContent sx={{ p: "14px 18px !important" }}>
                <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: s.color, letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {loading ? "—" : s.value}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600, mt: 0.4 }}>{s.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pending alert */}
      {!loading && pending > 0 && (
        <Alert
          severity="warning"
          sx={{ mb: 2.5, borderRadius: "8px", bgcolor: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E" }}
          icon={<WorkIcon sx={{ fontSize: 18 }} />}
        >
          <strong>{pending} placement{pending > 1 ? "s" : ""}</strong> waiting for your review.
        </Alert>
      )}

      {/* Table card */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Toolbar */}
          <Box sx={{ px: 2.5, pt: 2, pb: 1.5, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            {/* Filter chips */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", flex: 1 }}>
              {FILTER_TABS.map((f) => (
                <Chip
                  key={f.key}
                  label={f.label}
                  size="small"
                  onClick={() => setFilter(f.key)}
                  sx={{
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    height: 26,
                    bgcolor: filter === f.key ? "#4F46E5" : "#F1F5F9",
                    color: filter === f.key ? "#fff" : "#64748B",
                    "&:hover": { bgcolor: filter === f.key ? "#4338CA" : "#E2E8F0" },
                  }}
                />
              ))}
            </Box>
            {/* Search */}
            <TextField
              size="small"
              placeholder="Search by student, company or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "#94A3B8" }} /></InputAdornment>,
              }}
              sx={{ width: 280, "& .MuiOutlinedInput-root": { borderRadius: "6px", fontSize: "0.83rem" } }}
            />
          </Box>
          <Divider />

          {loading ? (
            <Box sx={{ p: 2.5 }}>
              {[1, 2, 3, 4].map((i) => (
                <Box key={i} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
                  <Skeleton variant="circular" width={36} height={36} />
                  <Box sx={{ flex: 1 }}><Skeleton variant="text" width="60%" /><Skeleton variant="text" width="35%" /></Box>
                  <Skeleton variant="rounded" width={70} height={22} />
                  <Skeleton variant="rounded" width={72} height={30} />
                </Box>
              ))}
            </Box>
          ) : visible.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <WorkIcon sx={{ fontSize: 40, color: "#E2E8F0", mb: 1 }} />
              <Typography sx={{ color: "#94A3B8", fontSize: "0.875rem" }}>
                {search ? "No results found for your search." : "No placement submissions yet."}
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Package</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((p) => {
                  const s = STATUS[p.status] ?? STATUS["Pending Mentor"];
                  return (
                    <TableRow
                      key={p._id}
                      sx={{ "&:hover": { bgcolor: "#F8FAFC" }, cursor: "pointer" }}
                      onClick={() => setSelected(p)}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor(p.studentName), fontSize: "0.75rem", fontWeight: 700 }}>
                            {p.studentName?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: "0.845rem", color: "#0F172A" }}>{p.studentName}</Typography>
                            {p.studentEmail && (
                              <Typography sx={{ fontSize: "0.72rem", color: "#94A3B8" }}>{p.studentEmail}</Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <BusinessIcon sx={{ fontSize: 14, color: "#94A3B8" }} />
                          <Typography sx={{ fontSize: "0.845rem", fontWeight: 500 }}>{p.company}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "#64748B", fontSize: "0.84rem" }}>{p.role || "—"}</TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.84rem" }}>
                          {p.package} <Typography component="span" sx={{ fontWeight: 400, color: "#94A3B8", fontSize: "0.72rem" }}>LPA</Typography>
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: "#64748B", fontSize: "0.8rem" }}>
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={s.label}
                          size="small"
                          sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: "0.72rem", height: 22 }}
                        />
                      </TableCell>
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        {p.status === "Pending Mentor" ? (
                          <Box sx={{ display: "flex", gap: 0.75, justifyContent: "flex-end" }}>
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                onClick={(e) => { e.stopPropagation(); setSelected(p); }}
                                sx={{ color: "#16A34A", "&:hover": { bgcolor: "#F0FDF4" } }}
                              >
                                <ApproveIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                                size="small"
                                onClick={(e) => { e.stopPropagation(); setSelected(p); }}
                                sx={{ color: "#DC2626", "&:hover": { bgcolor: "#FEF2F2" } }}
                              >
                                <RejectIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={(e) => { e.stopPropagation(); setSelected(p); }}
                              sx={{ color: "#64748B", "&:hover": { bgcolor: "#F1F5F9" } }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
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

      {/* Detail dialog */}
      <DetailDialog
        open={!!selected}
        record={selected}
        onClose={() => setSelected(null)}
        onAction={handleAction}
      />

      {/* Snackbar */}
      {snack.show && (
        <Alert
          severity={snack.sev}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, show: false }))}
          sx={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", borderRadius: "8px", minWidth: 300, zIndex: 9999 }}
        >
          {snack.msg}
        </Alert>
      )}
    </Box>
  );
}
