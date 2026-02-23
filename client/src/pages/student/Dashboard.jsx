import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import api from "../../services/api";

export default function Dashboard() {
  const [rewards, setRewards] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const r = await api.get("/rewardpoints");
      const l = await api.get("/leaverequests");
      const p = await api.get("/placementrequests");

      setRewards(r.data);
      setLeaves(l.data);
      setPlacements(p.data);
    };

    fetchData();
  }, []);

  const totalPoints = rewards.reduce((acc, r) => acc + r.points, 0);
  const pendingLeaves = leaves.filter(l => l.status === "pending").length;
  const placementStatus =
    placements.length > 0
      ? placements[placements.length - 1].status
      : "No Request";

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Student Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Total Reward Points</Typography>
              <Typography variant="h4">{totalPoints}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Pending Leave Requests</Typography>
              <Typography variant="h4">{pendingLeaves}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Placement Status</Typography>
              <Typography variant="h6">{placementStatus}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
