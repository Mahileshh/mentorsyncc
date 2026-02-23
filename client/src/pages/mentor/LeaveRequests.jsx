import { useEffect, useState } from "react";
import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Button, Chip, Typography
} from "@mui/material";
import api from "../../services/api";

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    const res = await api.get("/leaverequests");
    setLeaves(res.data);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleUpdate = async (id, status) => {
    await api.patch(`/leaverequests/${id}`, { status });
    fetchLeaves();
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Leave Requests
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {leaves.map((l) => (
            <TableRow key={l._id}>
              <TableCell>{l.studentName}</TableCell>
              <TableCell>{l.reason}</TableCell>
              <TableCell>
                <Chip label={l.status}
                  color={
                    l.status === "approved"
                      ? "success"
                      : l.status === "rejected"
                      ? "error"
                      : "warning"
                  }
                />
              </TableCell>
              <TableCell>
                {l.status === "pending" && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleUpdate(l._id, "approved")}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleUpdate(l._id, "rejected")}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
