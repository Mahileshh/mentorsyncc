import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Divider,
  Avatar,
  Skeleton,
  LinearProgress,
} from "@mui/material";
import { EmojiEvents as TrophyIcon, WorkspacePremium as MedalIcon } from "@mui/icons-material";
import api from "../../services/api";

export default function MyRewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/my-rewards")
      .then((res) => setRewards(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = rewards.reduce((a, r) => a + r.points, 0);
  const nextLevel = Math.ceil(total / 500) * 500;
  const progress = ((total % 500) / 500) * 100;


  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: "#0F172A", letterSpacing: "-0.02em" }}>
          My Rewards
        </Typography>
        <Typography sx={{ color: "#64748B", fontSize: "0.865rem", mt: 0.25 }}>
          Points awarded by your mentor for achievements.
        </Typography>
      </Box>

      {/* Summary cards */}
      <Box sx={{ display: "flex", gap: 2.5, mb: 3, flexWrap: "wrap" }}>
        {/* Total points */}
        <Card sx={{ flex: "1 1 220px" }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
              <Box>
                {loading ? <Skeleton variant="text" width={60} height={44} /> : (
                  <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {total}
                  </Typography>
                )}
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#64748B", mt: 0.5 }}>
                  Total Points
                </Typography>
              </Box>
              <Avatar sx={{ width: 38, height: 38, bgcolor: "#FFFBEB", color: "#D97706", borderRadius: "8px" }}>
                <TrophyIcon sx={{ fontSize: 18 }} />
              </Avatar>
            </Box>
            <Box sx={{ mb: 0.75, display: "flex", justifyContent: "space-between" }}>
              {/* <Typography sx={{ fontSize: "0.73rem", color: "#94A3B8" }}>
                {total % 500} / 500 to next milestone
              </Typography> */}
              <Typography sx={{ fontSize: "0.73rem", fontWeight: 700, color: "#4F46E5" }}>
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 4, borderRadius: 99, bgcolor: "#EEF2FF", "& .MuiLinearProgress-bar": { bgcolor: "#4F46E5", borderRadius: 99 } }}
            />
          </CardContent>
        </Card>

        {/* Entries */}
        <Card sx={{ flex: "1 1 160px" }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <Box>
                <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {rewards.length}
                </Typography>
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#64748B", mt: 0.5 }}>
                  Entries
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
            <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
              Points History
            </Typography>
           
          </Box>
          <Divider />
          {loading ? (
            <Box sx={{ p: 2.5 }}>
              {[1, 2, 3].map((i) => <Skeleton key={i} variant="text" height={36} sx={{ mb: 1 }} />)}
            </Box>
          ) : rewards.length === 0 ? (
            <Box sx={{ py: 5, textAlign: "center" }}>
              <TrophyIcon sx={{ fontSize: 40, color: "#E2E8F0", mb: 1 }} />
              <Typography sx={{ color: "#94A3B8", fontSize: "0.875rem" }}>
                No rewards yet
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...rewards].reverse().map((r) => (
                  <TableRow
                    key={r._id}
                    sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{r.description || "—"}</TableCell>
                    <TableCell>
                      <Chip
                        label={`+${r.points}`}
                        size="small"
                        sx={{ fontWeight: 700, fontSize: "0.73rem", bgcolor: "#F0FDF4", color: "#16A34A", height: 22 }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#64748B" }}>
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
