import { useEffect, useState } from "react";
import {
  Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Paper
} from "@mui/material";
import api from "../../services/api";

export default function RewardPoints() {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    const fetchRewards = async () => {
      const res = await api.get("/rewardpoints");
      setRewards(res.data);
    };
    fetchRewards();
  }, []);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Reward Points
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Last Updated</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rewards.map((r) => (
              <TableRow key={r._id}>
                <TableCell>{r.studentName}</TableCell>
                <TableCell>{r.points}</TableCell>
                <TableCell>{r.updatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
