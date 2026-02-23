import { useEffect, useState } from "react";
import {
  Typography, Table, TableHead,
  TableRow, TableCell, TableBody,
  Button, Chip, Paper
} from "@mui/material";
import api from "../../services/api";

export default function PlacementRequests() {
  const [placements, setPlacements] = useState([]);

  const fetchPlacements = async () => {
    const res = await api.get("/placementrequests");
    setPlacements(res.data);
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const handleUpdate = async (id, status) => {
    await api.patch(`/placementrequests/${id}`, { status });
    fetchPlacements();
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Placement Requests
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Package</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {placements.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.studentName}</TableCell>
                <TableCell>{p.company}</TableCell>
                <TableCell>{p.package}</TableCell>
                <TableCell>
                  <Chip
                    label={p.status}
                    color={
                      p.status === "approved"
                        ? "success"
                        : p.status === "rejected"
                        ? "error"
                        : "warning"
                    }
                  />
                </TableCell>
                <TableCell>
                  {p.status === "pending" && (
                    <>
                      <Button
                        size="small"
                        color="success"
                        variant="contained"
                        onClick={() =>
                          handleUpdate(p._id, "approved")
                        }
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() =>
                          handleUpdate(p._id, "rejected")
                        }
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
      </Paper>
    </>
  );
}
