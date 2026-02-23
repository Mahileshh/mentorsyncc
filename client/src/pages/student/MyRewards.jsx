import { useEffect, useState } from "react";
import {
  Typography,
  Table, TableHead,
  TableRow, TableCell,
  TableBody, Paper
} from "@mui/material";
import api from "../../services/api";

export default function MyRewards() {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    const fetchRewards = async () => {
      const res = await api.get("/rewardpoints");
      setRewards(res.data);
    };
    fetchRewards();
  }, []);

  const totalPoints = rewards.reduce((acc, r) => acc + r.points, 0);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        My Rewards
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Total Points: {totalPoints}
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rewards.map((r) => (
              <TableRow key={r._id}>
                <TableCell>{r.description}</TableCell>
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
