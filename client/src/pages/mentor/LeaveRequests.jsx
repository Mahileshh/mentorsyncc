import { useEffect, useState } from "react";
import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Button, Chip, Typography,
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  TablePagination,
  TableContainer,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Stack,
  Tooltip,
  LinearProgress,
  Divider
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  EventNote as EventIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  HourglassTop as PendingIcon,
  BeachAccess as LeaveLeftIcon,
  TrendingUp as TotalIcon,
} from "@mui/icons-material";
import api from "../../services/api";

// ─── Stat Card Component ─────────────────────────────────────────────────────
function StatCard({ label, value, icon, gradient, iconColor, subLabel }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        background: gradient,
        border: "1px solid",
        borderColor: alpha(iconColor, 0.18),
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: `0 12px 32px ${alpha(iconColor, 0.18)}`,
        },
      }}
    >
      {/* Decorative circle */}
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: alpha(iconColor, 0.12),
        }}
      />
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, lineHeight: 1.1, color: iconColor, mb: 0.5 }}
            >
              {value}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", mb: 0.25 }}>
              {label}
            </Typography>
            {subLabel && (
              <Typography variant="caption" color="text.secondary">
                {subLabel}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: alpha(iconColor, 0.15),
              color: iconColor,
              mt: 0.5,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LeaveRequests() {
  const theme = useTheme();
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Configurable leave quota (could come from API in real usage)
  const TOTAL_LEAVE_QUOTA = 30;

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/mentor/leaves");
      setLeaves(res.data);
      setFilteredLeaves(res.data);
    } catch (err) {
      setError("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  useEffect(() => {
    let result = leaves;
    if (searchTerm) {
      result = result.filter(l =>
        l.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      result = result.filter(l => l.status === statusFilter);
    }
    setFilteredLeaves(result);
    setPage(0);
  }, [searchTerm, statusFilter, leaves]);

  const handleUpdate = async (id, status) => {
    try {
      await api.post("/mentor/approve-leave", { leaveId: id, status });
      await fetchLeaves();
      setSnackbar({ open: true, message: `Leave ${status} successfully`, severity: status === "approved" ? "success" : "error" });
    } catch {
      setSnackbar({ open: true, message: "Failed to update leave request", severity: "error" });
    }
  };

  const getStatusColor = (s) =>
    ({ approved: "success", rejected: "error", pending: "warning" }[s] || "default");

  const totalRequests = leaves.length;
  const pendingCount = leaves.filter(l => l.status === "pending").length;
  const approvedCount = leaves.filter(l => l.status === "approved").length;
  const rejectedCount = leaves.filter(l => l.status === "rejected").length;
  const leaveLeft = Math.max(0, TOTAL_LEAVE_QUOTA - approvedCount);

  const stats = [
    {
      label: "Total Requests",
      value: totalRequests,
      icon: <TotalIcon />,
      iconColor: theme.palette.info.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.08)} 0%, ${alpha(theme.palette.info.light, 0.04)} 100%)`,
      subLabel: "All time submissions",
    },
    {
      label: "Pending Review",
      value: pendingCount,
      icon: <PendingIcon />,
      iconColor: theme.palette.warning.dark,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.light, 0.04)} 100%)`,
      subLabel: "Awaiting your action",
    },
    {
      label: "Approved",
      value: approvedCount,
      icon: <ApproveIcon />,
      iconColor: theme.palette.success.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(theme.palette.success.light, 0.04)} 100%)`,
      subLabel: "Requests approved",
    },
    {
      label: "Rejected",
      value: rejectedCount,
      icon: <RejectIcon />,
      iconColor: theme.palette.error.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.08)} 0%, ${alpha(theme.palette.error.light, 0.04)} 100%)`,
      subLabel: "Requests declined",
    },
    {
      label: "Leave Left",
      value: leaveLeft,
      icon: <LeaveLeftIcon />,
      iconColor: "#7C3AED",
      gradient: `linear-gradient(135deg, ${alpha("#7C3AED", 0.08)} 0%, ${alpha("#A78BFA", 0.04)} 100%)`,
      subLabel: `Out of ${TOTAL_LEAVE_QUOTA} quota`,
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: "auto" }}>

      {/* ── Header ── */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3.5 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: "-0.3px", mb: 0.5 }}>
            Leave Requests
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review and manage student leave applications
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={fetchLeaves}
          sx={{ borderRadius: 2.5, fontWeight: 600, textTransform: "none", px: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {/* ── Stat Cards ── */}
      <Grid container spacing={2} sx={{ mb: 3.5 }}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={12 / 5} key={s.label}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      {/* ── Filters ── */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2.5,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
          bgcolor: alpha(theme.palette.background.paper, 0.8),
        }}
      >
        <TextField
          size="small"
          placeholder="Search student or reason…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2.5 },
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
            sx={{ borderRadius: 2.5 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
          {filteredLeaves.length} result{filteredLeaves.length !== 1 ? "s" : ""}
        </Typography>
      </Paper>

      {/* ── Error ── */}
      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2.5 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* ── Loading ── */}
      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

      {/* ── Table ── */}
      {!loading && (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  "& th": {
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    color: "text.secondary",
                    borderBottom: `2px solid ${alpha(theme.palette.divider, 0.12)}`,
                  },
                }}
              >
                <TableCell>Student</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredLeaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 7 }}>
                    <EventIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      No leave requests found
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {searchTerm || statusFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "No submissions yet"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeaves
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((leave) => (
                    <TableRow
                      key={leave._id}
                      sx={{
                        "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.025) },
                        "& td": { borderBottom: `1px solid ${alpha(theme.palette.divider, 0.07)}` },
                      }}
                    >
                      {/* Student */}
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              bgcolor: alpha(theme.palette.primary.main, 0.12),
                              color: theme.palette.primary.main,
                              fontSize: "0.85rem",
                              fontWeight: 700,
                            }}
                          >
                            {leave.studentName?.charAt(0) || <PersonIcon fontSize="small" />}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>
                            {leave.studentName}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Reason */}
                      <TableCell>
                        <Tooltip title={leave.reason} placement="top">
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              maxWidth: 220,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              cursor: "default",
                            }}
                          >
                            {leave.reason}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      {/* Duration */}
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.75,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.07),
                          }}
                        >
                          <CalendarIcon sx={{ fontSize: 13, color: theme.palette.info.main }} />
                          <Typography variant="caption" fontWeight={600} color={theme.palette.info.dark}>
                            {new Date(leave.fromDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            {" – "}
                            {new Date(leave.toDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                          size="small"
                          color={getStatusColor(leave.status)}
                          variant="filled"
                          sx={{ fontWeight: 600, fontSize: "0.72rem", minWidth: 82, borderRadius: 1.5 }}
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => { setSelectedLeave(leave); setDialogOpen(true); }}
                              sx={{
                                color: theme.palette.info.main,
                                "&:hover": { bgcolor: alpha(theme.palette.info.main, 0.1) },
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {leave.status === "pending" && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton
                                  size="small"
                                  onClick={() => handleUpdate(leave._id, "approved")}
                                  sx={{ color: theme.palette.success.main, "&:hover": { bgcolor: alpha(theme.palette.success.main, 0.1) } }}
                                >
                                  <ApproveIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton
                                  size="small"
                                  onClick={() => handleUpdate(leave._id, "rejected")}
                                  sx={{ color: theme.palette.error.main, "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.1) } }}
                                >
                                  <RejectIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredLeaves.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            sx={{ borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}
          />
        </TableContainer>
      )}

      {/* ── Details Dialog ── */}
      <Dialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setSelectedLeave(null); }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        {selectedLeave && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
                pt: 3,
                pb: 2,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography variant="h6" fontWeight={700}>Leave Request Details</Typography>
              <IconButton size="small" onClick={() => { setDialogOpen(false); setSelectedLeave(null); }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: 3, pt: 3, pb: 3 }}>
              {/* Student identity row */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    fontSize: "1.2rem",
                  }}
                >
                  {selectedLeave.studentName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {selectedLeave.studentName}
                  </Typography>
                  <Chip
                    label={selectedLeave.status.charAt(0).toUpperCase() + selectedLeave.status.slice(1)}
                    size="small"
                    color={getStatusColor(selectedLeave.status)}
                    sx={{ fontWeight: 600, mt: 0.3 }}
                  />
                </Box>
              </Box>

              <Divider sx={{ mb: 2.5 }} />

              {/* Reason */}
              <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={0.75}>
                <DescriptionIcon sx={{ fontSize: 13, mr: 0.5, verticalAlign: "middle" }} />
                REASON FOR LEAVE
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 2, borderRadius: 2.5, bgcolor: alpha(theme.palette.background.default, 0.5), mb: 2.5 }}
              >
                <Typography variant="body2">{selectedLeave.reason}</Typography>
              </Paper>

              {/* Dates */}
              <Grid container spacing={2} mb={2.5}>
                {[["From Date", selectedLeave.fromDate], ["To Date", selectedLeave.toDate]].map(([lbl, date]) => (
                  <Grid item xs={6} key={lbl}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      }}
                    >
                      <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={0.5}>
                        {lbl}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Duration chip */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary">DURATION</Typography>
                <Chip
                  label={`${Math.ceil((new Date(selectedLeave.toDate) - new Date(selectedLeave.fromDate)) / 86400000) + 1} days`}
                  size="small"
                  color="info"
                  sx={{ fontWeight: 700 }}
                />
              </Box>

              {/* Quick actions */}
              {selectedLeave.status === "pending" && (
                <>
                  <Divider sx={{ mb: 2 }} />
                  <Stack direction="row" spacing={1.5}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<ApproveIcon />}
                      onClick={() => { handleUpdate(selectedLeave._id, "approved"); setDialogOpen(false); setSelectedLeave(null); }}
                      sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, py: 1.2 }}
                    >
                      Approve
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      startIcon={<RejectIcon />}
                      onClick={() => { handleUpdate(selectedLeave._id, "rejected"); setDialogOpen(false); setSelectedLeave(null); }}
                      sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, py: 1.2 }}
                    >
                      Reject
                    </Button>
                  </Stack>
                </>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* ── Snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2.5, fontWeight: 600 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
