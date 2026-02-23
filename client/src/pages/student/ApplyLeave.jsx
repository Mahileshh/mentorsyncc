import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import api from "../../services/api";

export default function ApplyLeave() {
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleSubmit = async () => {
    await api.post("/leaverequests", {
      reason,
      fromDate,
      toDate
    });

    alert("Leave Applied Successfully");
    setReason("");
    setFromDate("");
    setToDate("");
  };

  return (
    <Card sx={{ maxWidth: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Apply Leave
        </Typography>

        <TextField
          fullWidth
          label="Reason"
          margin="normal"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <TextField
          fullWidth
          type="date"
          margin="normal"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <TextField
          fullWidth
          type="date"
          margin="normal"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}
