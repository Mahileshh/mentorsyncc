import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import api from "../../services/api";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const s = await api.get("/mentorstudents");
      const l = await api.get("/leaverequests");
      const p = await api.get("/placementrequests");

      setStudents(s.data);
      setLeaves(l.data);
      setPlacements(p.data);
    };

    fetchData();
  }, []);

  const pendingLeaves = leaves.filter(l => l.status === "pending").length;
  const pendingPlacements = placements.filter(p => p.status === "pending").length;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Students</Typography>
            <Typography variant="h4">{students.length}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Pending Leaves</Typography>
            <Typography variant="h4">{pendingLeaves}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Pending Placements</Typography>
            <Typography variant="h4">{pendingPlacements}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
