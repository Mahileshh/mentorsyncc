import { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import api from "../../services/api";

export default function PlacementRequest() {
  const [company, setCompany] = useState("");
  const [pkg, setPkg] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!company || !pkg) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/placementrequests", {
        company,
        package: pkg
      });

      setOpen(true);
      setCompany("");
      setPkg("");

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Placement Request
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Company Name"
            margin="normal"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <TextField
            fullWidth
            label="Package (LPA)"
            margin="normal"
            value={pkg}
            onChange={(e) => setPkg(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert severity="success" variant="filled">
          Placement Request Submitted
        </Alert>
      </Snackbar>
    </>
  );
}
