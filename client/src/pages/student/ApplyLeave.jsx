import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Snackbar,
  Paper,
  Divider,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel
} from "@mui/material";
import {
  Send as SendIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon
} from "@mui/icons-material";
import api from "../../services/api";

export default function ApplyLeave() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    reason: "",
    fromDate: "",
    toDate: "",
    leaveType: "full-day",
    contactNumber: "",
    alternateArrangements: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [leaveBalance, setLeaveBalance] = useState({ remaining: 0, total: 15, quota: 15, attendance: 75 });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setBalanceLoading(true);
        const [profRes, leavesRes] = await Promise.all([
          api.get("/student/profile"),
          api.get("/student/my-leaves")
        ]);

        const approvedLeaves = leavesRes.data.filter(l => l.status === "approved");
        const usedDays = approvedLeaves.reduce((acc, l) => {
          const from = new Date(l.fromDate);
          const to = new Date(l.toDate);
          const diffDays = Math.ceil(Math.abs(to - from) / (1000 * 60 * 60 * 24)) + 1;
          return acc + diffDays;
        }, 0);

        // maxLeaves is the system-wide fixed constant (same for everyone)
        const total      = profRes.data.maxLeaves || 15;
        const attendance = profRes.data.attendance ?? 75;
        // Attendance-based quota computed server-side
        const quota      = profRes.data.attendanceBasedLeaveQuota ?? total;

        setLeaveBalance({
          total,
          attendance,
          quota,
          remaining: Math.max(0, quota - usedDays),
          usedDays,
        });
      } catch (err) {
        console.error("Error fetching leave balance:", err);
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const leaveTypes = [
    { value: "full-day", label: "Full Day" },
    { value: "half-day", label: "Half Day" },
    { value: "short-leave", label: "Short Leave (Hours)" }
  ];

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    } else if (formData.reason.length < 10) {
      newErrors.reason = "Please provide a detailed reason (minimum 10 characters)";
    }

    if (!formData.fromDate.trim()) {
      newErrors.fromDate = "Start date is required";
    }

    if (!formData.toDate.trim()) {
      newErrors.toDate = "End date is required";
    }

    if (formData.fromDate && formData.toDate) {
      if (formData.fromDate > formData.toDate) {
        newErrors.toDate = "End date cannot be before start date";
      }
    }

    if (formData.contactNumber && !/^[0-9]{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid 10-digit phone number";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Auto-navigate to the step that owns the first error so the user can see it
      const step0Fields = ["reason", "fromDate", "toDate"];
      const step1Fields = ["contactNumber", "alternateArrangements"];
      if (step0Fields.some((f) => newErrors[f])) {
        setActiveStep(0);
      } else if (step1Fields.some((f) => newErrors[f])) {
        setActiveStep(1);
      }
      setSnackbar({
        open: true,
        message: "Please fix the highlighted errors before submitting",
        severity: "error"
      });
      return;
    }

    setLoading(true);

    try {
      await api.post("/student/apply-leave", {
        reason: formData.reason,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        leaveType: formData.leaveType,
        contactNumber: formData.contactNumber,
        alternateArrangements: formData.alternateArrangements
      });

      setSnackbar({
        open: true,
        message: "Leave application submitted successfully!",
        severity: "success"
      });

      // Reset form
      setFormData({
        reason: "",
        fromDate: "",
        toDate: "",
        leaveType: "full-day",
        contactNumber: "",
        alternateArrangements: ""
      });
      setActiveStep(0);

    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to submit leave application",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Run the same strict validation as submit so errors are caught early
      const stepErrors = {};
      if (!formData.reason.trim()) {
        stepErrors.reason = "Reason is required";
      } else if (formData.reason.length < 10) {
        stepErrors.reason = "Please provide a detailed reason (minimum 10 characters)";
      }
      if (!formData.fromDate) stepErrors.fromDate = "Start date is required";
      if (!formData.toDate) stepErrors.toDate = "End date is required";
      if (formData.fromDate && formData.toDate && formData.fromDate > formData.toDate) {
        stepErrors.toDate = "End date cannot be before start date";
      }
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        setSnackbar({ open: true, message: "Please fix the highlighted errors", severity: "warning" });
        return;
      }
    }
    if (activeStep === 1 && formData.contactNumber && !/^[0-9]{10}$/.test(formData.contactNumber)) {
      setErrors({ contactNumber: "Please enter a valid 10-digit phone number" });
      setSnackbar({ open: true, message: "Please fix the highlighted errors", severity: "warning" });
      return;
    }
    setErrors({});
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const calculateLeaveDays = () => {
    if (!formData.fromDate || !formData.toDate) return 0;
    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const steps = [
    {
      label: 'Leave Details',
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Reason for Leave"
              multiline
              rows={4}
              value={formData.reason}
              onChange={handleChange("reason")}
              error={!!errors.reason}
              helperText={errors.reason || "Provide a detailed reason for your leave"}
              disabled={loading}
              placeholder="e.g., Medical appointment, Family function, Personal work..."
              InputProps={{
                startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              type="date"
              fullWidth
              label="From Date"
              InputLabelProps={{ shrink: true }}
              value={formData.fromDate}
              onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
              error={!!errors.fromDate}
              helperText={errors.fromDate}
              disabled={loading}
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              type="date"
              fullWidth
              label="To Date"
              InputLabelProps={{ shrink: true }}
              value={formData.toDate}
              onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
              error={!!errors.toDate}
              helperText={errors.toDate}
              disabled={loading}
              inputProps={{ min: formData.fromDate || new Date().toISOString().split('T')[0] }}
            />
          </Grid>

          {formData.fromDate && formData.toDate && (
            <Grid item xs={12}>
              <Alert
                icon={<CalendarIcon />}
                severity="info"
                sx={{
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main
                }}
              >
                Leave duration: {calculateLeaveDays()} day(s)
              </Alert>
            </Grid>
          )}
        </Grid>
      )
    },
    {
      label: 'Additional Information',
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Leave Type</FormLabel>
              <RadioGroup
                row
                value={formData.leaveType}
                onChange={handleChange("leaveType")}
              >
                {leaveTypes.map((type) => (
                  <FormControlLabel
                    key={type.value}
                    value={type.value}
                    control={<Radio />}
                    label={type.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Number (Optional)"
              value={formData.contactNumber}
              onChange={handleChange("contactNumber")}
              error={!!errors.contactNumber}
              helperText={errors.contactNumber || "For emergency contact during leave"}
              disabled={loading}
              placeholder="10-digit mobile number"
              InputProps={{
                startAdornment: <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Alternate Arrangements (Optional)"
              multiline
              rows={3}
              value={formData.alternateArrangements}
              onChange={handleChange("alternateArrangements")}
              disabled={loading}
              placeholder="Any work handover or arrangements made during your absence..."
            />
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Review & Submit',
      content: (
        <Box>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: alpha(theme.palette.background.default, 0.5),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <Typography variant="subtitle1" gutterBottom fontWeight="600">
              Review Your Application
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Reason:</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{formData.reason}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Leave Type:</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {leaveTypes.find(t => t.value === formData.leaveType)?.label}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">From Date:</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formData.fromDate ? new Date(formData.fromDate).toLocaleDateString() : 'Not Set'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">To Date:</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formData.toDate ? new Date(formData.toDate).toLocaleDateString() : 'Not Set'}
                </Typography>
              </Grid>

              {formData.contactNumber && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Contact:</Typography>
                  <Typography variant="body1">{formData.contactNumber}</Typography>
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Alert severity="warning" icon={<WarningIcon />}>
              Please verify all details before submitting. Changes cannot be made after submission.
            </Alert>
          </Paper>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            width: 56,
            height: 56,
            mr: 2
          }}
        >
          <EventIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Apply for Leave
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Submit your leave request for approval
          </Typography>
        </Box>
      </Box>

      {/* Main Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: 'visible'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Leave Balance Alert — attendance-aware */}
          {!balanceLoading && (() => {
            const att = leaveBalance.attendance ?? 75;
            const tc = att >= 75 ? { label: "Good",      color: "success" } :
                                   { label: "Low",       color: "warning" };
            return (
              <Alert
                severity={tc.color}
                sx={{ mb: 3, borderRadius: 2 }}
                icon={<InfoIcon />}
              >
                <strong>{leaveBalance.remaining} of {leaveBalance.quota} leave days</strong> remaining based on your
                {" "}<strong>{att}% attendance</strong> ({tc.label}).
                {" "}{leaveBalance.usedDays > 0 && `${leaveBalance.usedDays} days already used. `}
                System max: {leaveBalance.total} days for all students. (≥75% attendance grants full quota)
              </Alert>
            );
          })()}
          {balanceLoading && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }} icon={<InfoIcon />}>
              Checking leave balance…
            </Alert>
          )}

          {/* Stepper */}
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            sx={{
              '& .MuiStepLabel-root .Mui-completed': {
                color: theme.palette.success.main
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: theme.palette.primary.main
              }
            }}
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  {step.content}

                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                      disabled={loading}
                      startIcon={index === steps.length - 1 ? <SendIcon /> : null}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none'
                      }}
                    >
                      {index === steps.length - 1
                        ? (loading ? 'Submitting...' : 'Submit Application')
                        : 'Continue'
                      }
                    </Button>

                    {index > 0 && (
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        disabled={loading}
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                      >
                        Back
                      </Button>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          {/* Quick Tips */}
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 2,
              bgcolor: alpha(theme.palette.warning.main, 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
            }}
          >
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon fontSize="small" color="warning" />
              Quick Tips:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" color="text.secondary">
                  • Submit at least 3 days in advance
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" color="text.secondary">
                  • Provide valid contact details
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" color="text.secondary">
                  • Mention work handover plans
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </CardContent>
      </Card>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}