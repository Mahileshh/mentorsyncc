import { useEffect, useState } from "react";
import {
  Typography, Box, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody,
  Chip, Divider, Avatar, Snackbar, Alert, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, LinearProgress, IconButton
} from "@mui/material";
import {
  Assignment as ExemptionIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import api from "../../services/api";

const STATUS_MAP = {
  "Approved": { color: "#16A34A", bg: "#F0FDF4" },
  "Pending Mentor": { color: "#D97706", bg: "#FFFBEB" },
  "Rejected": { color: "#DC2626", bg: "#FEF2F2" }
};

export default function CourseExemptions() {
  const [exemptions, setExemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  // Reject Dialog
  const [dialog, setDialog] = useState({ open: false, id: null, reason: "" });
  const [updating, setUpdating] = useState(false);
  
  // Details Dialog
  const [detailsDialog, setDetailsDialog] = useState({ open: false, data: null });

  const fetchExemptions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/mentor/exemptions");
      setExemptions(res.data);
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

  const handleApprove = async (id) => {
    try {
      setUpdating(true);
      await api.patch(`/mentor/exemptions/${id}`, { status: "Approved" });
      setSnackbar({ open: true, message: "Exemption approved", severity: "success" });
      fetchExemptions();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || "Error approving", severity: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!dialog.reason.trim()) {
      setSnackbar({ open: true, message: "Rejection reason required", severity: "warning" });
      return;
    }
    try {
      setUpdating(true);
      await api.patch(`/mentor/exemptions/${dialog.id}`, { 
        status: "Rejected", 
        rejectionReason: dialog.reason 
      });
      setSnackbar({ open: true, message: "Exemption rejected", severity: "success" });
      setDialog({ open: false, id: null, reason: "" });
      fetchExemptions();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || "Error rejecting", severity: "error" });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: "#0F172A", letterSpacing: "-0.02em" }}>
          Course Exemptions
        </Typography>
        <Typography sx={{ color: "#64748B", fontSize: "0.865rem", mt: 0.25 }}>
          Review exemption requests from your assigned students.
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <LinearProgress sx={{ height: 2 }} />
          ) : exemptions.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <ExemptionIcon sx={{ fontSize: 40, color: "#E2E8F0", mb: 1 }} />
              <Typography sx={{ color: "#94A3B8", fontSize: "0.875rem" }}>
                No exemption requests to review
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ "& th": { fontWeight: 600, color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" } }}>
                  <TableCell>Student</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Reason / Evidence</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exemptions.map((ex) => {
                  const st = STATUS_MAP[ex.status] || STATUS_MAP["Pending Mentor"];
                  return (
                    <TableRow key={ex._id} sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#0F172A" }}>
                          {ex.studentName}
                        </Typography>
                        <Typography sx={{ fontSize: "0.72rem", color: "#64748B" }}>
                          {ex.studentEmail}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500, color: "#0F172A" }}>{ex.subjectName}</TableCell>
                      <TableCell sx={{ maxWidth: 250, fontSize: "0.8rem", color: "#475569" }}>{ex.reason}</TableCell>
                      <TableCell>
                        <Chip
                          label={ex.status === "Pending Mentor" ? "Pending" : ex.status}
                          size="small"
                          sx={{ bgcolor: st.bg, color: st.color, fontWeight: 700, fontSize: "0.7rem", height: 22 }}
                        />
                        {ex.status === "Rejected" && ex.rejectionReason && (
                          <Typography sx={{ fontSize: "0.65rem", color: "#DC2626", mt: 0.5, maxWidth: 150, lineHeight: 1.2 }}>
                            Reason: {ex.rejectionReason}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                          <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={() => setDetailsDialog({ open: true, data: ex })}
                            sx={{ bgcolor: "#EEF2FF", "&:hover": { bgcolor: "#E0E7FF" } }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          {ex.status === "Pending Mentor" ? (
                            <>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => handleApprove(ex._id)}
                                disabled={updating}
                                sx={{ minWidth: 0, px: 2, borderRadius: 2, textTransform: "none", fontWeight: 600, boxShadow: "none" }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => setDialog({ open: true, id: ex._id, reason: "" })}
                                disabled={updating}
                                sx={{ minWidth: 0, px: 2, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                              >
                                Reject
                              </Button>
                            </>
                          ) : (
                            <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8" }}>Reviewed</Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, id: null, reason: "" })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>Reject Exemption</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "0.8rem", color: "#64748B", mb: 2 }}>
            Please provide a reason for rejecting this exemption. The student will see this message.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            placeholder="e.g. Missing valid certification document..."
            value={dialog.reason}
            onChange={(e) => setDialog({ ...dialog, reason: e.target.value })}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialog({ open: false, id: null, reason: "" })} sx={{ textTransform: "none", color: "#64748B" }}>
            Cancel
          </Button>
          <Button onClick={handleReject} disabled={updating} variant="contained" color="error" sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
            {updating ? "Rejecting..." : "Confirm Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog 
        open={detailsDialog.open} 
        onClose={() => setDetailsDialog({ open: false, data: null })} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.2rem", color: "#0F172A", borderBottom: "1px solid #E2E8F0", pb: 2 }}>
          Exemption Request Details
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {detailsDialog.data && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
              <Box>
                <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Student</Typography>
                <Typography sx={{ fontSize: "0.95rem", color: "#0F172A", fontWeight: 600 }}>{detailsDialog.data.studentName}</Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#475569" }}>{detailsDialog.data.studentEmail}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Subject & Credits</Typography>
                <Typography sx={{ fontSize: "0.95rem", color: "#0F172A", fontWeight: 600 }}>{detailsDialog.data.subjectName}</Typography>
                <Chip label={`${detailsDialog.data.creditCount || 3} Credits`} size="small" sx={{ mt: 0.5, bgcolor: "#EEF2FF", color: "#4F46E5", fontWeight: 700, fontSize: "0.7rem", height: 20 }} />
              </Box>
              <Divider />
              <Box>
                <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Reason & Evidence</Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#475569", mt: 0.5, whiteSpace: "pre-wrap" }}>{detailsDialog.data.reason}</Typography>
              </Box>
              {detailsDialog.data.certificationLink && (
                <>
                  <Divider />
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Certification Link</Typography>
                    <Typography 
                      component="a" 
                      href={detailsDialog.data.certificationLink.startsWith('http') ? detailsDialog.data.certificationLink : `https://${detailsDialog.data.certificationLink}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      sx={{ fontSize: "0.85rem", color: "#3B82F6", mt: 0.5, display: "inline-block", wordBreak: "break-all" }}
                    >
                      {detailsDialog.data.certificationLink}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, borderTop: "1px solid #E2E8F0" }}>
          {detailsDialog.data?.status === "Pending Mentor" && (
            <Box sx={{ display: "flex", gap: 1, flexGrow: 1 }}>
              <Button 
                onClick={() => {
                  handleApprove(detailsDialog.data._id);
                  setDetailsDialog({ open: false, data: null });
                }} 
                variant="contained" 
                color="success" 
                disabled={updating}
                sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
              >
                Approve
              </Button>
              <Button 
                onClick={() => {
                  setDialog({ open: true, id: detailsDialog.data._id, reason: "" });
                  setDetailsDialog({ open: false, data: null });
                }} 
                variant="outlined" 
                color="error" 
                disabled={updating}
                sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
              >
                Reject...
              </Button>
            </Box>
          )}
          <Button onClick={() => setDetailsDialog({ open: false, data: null })} variant="contained" sx={{ textTransform: "none", bgcolor: "#E2E8F0", color: "#475569", fontWeight: 600, borderRadius: 2, "&:hover": { bgcolor: "#CBD5E1" } }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
