import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  Chip,
  Snackbar,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ArrowForward as ArrowIcon,
  MenuBook as LogoIcon,
} from "@mui/icons-material";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const quickEmails = [
    { label: "Mentor", email: "chandru.k@mentor.com" },
    { label: "Student", email: "dharneshk7376232cb109@student.com" },
  ];

  useEffect(() => {
    const emailInput = document.querySelector("#email");
    if (emailInput) emailInput.focus();
  }, []);

  const validateForm = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!form.email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setEmailError("Enter a valid email address");
      valid = false;
    }

    if (!form.password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    } else if (form.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    return valid;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    if (e.target.name === "email") setEmailError("");
    if (e.target.name === "password") setPasswordError("");
  };

  const handleQuickFill = (email) => {
    setForm({ email, password: "123456" });
    setError("");
    setEmailError("");
    setPasswordError("");
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const data = await login(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      if (data.email) localStorage.setItem("email", data.email);

      setSnackbar({ open: true, message: "Logged in successfully", severity: "success" });

      if (data.role === "student") navigate("/student");
      else if (data.role === "mentor") navigate("/mentor");
      else if (data.role === "admin") navigate("/admin");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Invalid email or password.";
      setError(message);
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#F8FAFC",
      }}
    >
      {/* Left panel — brand */}
      <Box
        sx={{
          width: { xs: 0, md: "50%" },
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "#0F172A",
          p: 6,
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "8px",
              bgcolor: "#4F46E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogoIcon sx={{ color: "#fff", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#F1F5F9" }}>
            MentorSync
          </Typography>
        </Box>

        {/* Center content */}
        <Box>
          <Typography
            sx={{
              fontSize: { md: "2.4rem", lg: "3rem" },
              fontWeight: 800,
              color: "#F1F5F9",
              lineHeight: 1.15,
              mb: 2,
              letterSpacing: "-0.03em",
            }}
          >
            Your mentoring
            <br />
            hub, simplified.
          </Typography>
          <Typography sx={{ color: "#475569", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 380 }}>
            Track leaves, manage placements, and reward achievements — all in one place.
          </Typography>
        </Box>

        {/* Stats row */}
        <Box sx={{ display: "flex", gap: 4 }}>
          {[
            { value: "100%", label: "Transparent" },
            { value: "Real-time", label: "Updates" },
            { value: "Secure", label: "Access" },
          ].map((s) => (
            <Box key={s.label}>
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#F1F5F9" }}>
                {s.value}
              </Typography>
              <Typography sx={{ fontSize: "0.77rem", color: "#475569" }}>
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right panel — form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          {/* Mobile logo */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1.5,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "7px",
                bgcolor: "#4F46E5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LogoIcon sx={{ color: "#fff", fontSize: 17 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, color: "#0F172A" }}>MentorSync</Typography>
          </Box>

          <Typography
            sx={{ fontWeight: 800, fontSize: "1.75rem", color: "#0F172A", mb: 0.5, letterSpacing: "-0.02em" }}
          >
            Sign in
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: "0.875rem", mb: 3.5 }}>
            Enter your credentials to access your account.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, py: 0.75 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <Box sx={{ mb: 2 }}>
              <Typography
                component="label"
                sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", display: "block", mb: 0.75 }}
              >
                Email address
              </Typography>
              <TextField
                fullWidth
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                size="small"
                error={!!emailError}
                helperText={emailError || ""}
                aria-describedby="email-helper-text"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "6px" } }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                component="label"
                htmlFor="password"
                sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", display: "block", mb: 0.75 }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                size="small"
                error={!!passwordError}
                helperText={passwordError || ""}
                aria-describedby="password-helper-text"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "#94A3B8" }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "6px" } }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !form.email || !form.password}
              endIcon={<ArrowIcon />}
              sx={{
                py: 1.15,
                bgcolor: "#4F46E5",
                "&:hover": { bgcolor: "#4338CA" },
                borderRadius: "6px",
                fontSize: "0.9rem",
              }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </Box>

          {/* Quick logins */}
          <Box sx={{ mt: 3.5 }}>
            <Divider sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: "0.72rem", color: "#94A3B8", px: 1 }}>
                Quick access (dev)
              </Typography>
            </Divider>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {quickEmails.map((q) => (
                <Chip
                  key={q.email}
                  label={q.label}
                  size="small"
                  onClick={() => handleQuickFill(q.email)}
                  clickable
                  sx={{
                    bgcolor: "#F1F5F9",
                    color: "#475569",
                    fontWeight: 600,
                    fontSize: "0.73rem",
                    border: "1px solid #E2E8F0",
                    "&:hover": { bgcolor: "#E2E8F0" },
                  }}
                />
              ))}
            </Box>
            <Typography sx={{ fontSize: "0.72rem", color: "#94A3B8", mt: 1 }}>
              Default password: 123456
            </Typography>
          </Box>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            message={snackbar.message}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Login;