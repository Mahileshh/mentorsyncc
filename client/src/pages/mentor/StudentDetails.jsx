import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  useTheme,
  alpha,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as RewardIcon,
  BeachAccess as LeaveIcon,
  Work as PlacementIcon,
  Message as MessageIcon,
  TrendingUp as TrendingIcon,
  Grade as GradeIcon,
  Book as BookIcon,
  Assignment as TaskIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`student-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function StudentDetails({ student, onBack }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [studentData, setStudentData] = useState({
    rewards: [],
    leaves: [],
    placements: [],
    academics: {
      cgpa: 0,
      attendance: 0,
      backlogs: 0,
      marks: 0
    }
  });
  const [loading, setLoading] = useState({
    rewards: false,
    leaves: false,
    placements: false,
    academics: false
  });

  useEffect(() => {
    fetchStudentDetails();
  }, [student._id]);

  const fetchStudentDetails = async () => {
    // Fetch rewards
    try {
      setLoading(prev => ({ ...prev, rewards: true }));
      const rewardsRes = await api.get(`/mentor/students/${student._id}/rewards`);
      setStudentData(prev => ({ ...prev, rewards: rewardsRes.data }));
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(prev => ({ ...prev, rewards: false }));
    }

    // Fetch leaves
    try {
      setLoading(prev => ({ ...prev, leaves: true }));
      const leavesRes = await api.get(`/mentor/students/${student._id}/leaves`);
      setStudentData(prev => ({ ...prev, leaves: leavesRes.data }));
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(prev => ({ ...prev, leaves: false }));
    }

    // Fetch placements
    try {
      setLoading(prev => ({ ...prev, placements: true }));
      const placementsRes = await api.get(`/mentor/students/${student._id}/placements`);
      setStudentData(prev => ({ ...prev, placements: placementsRes.data }));
    } catch (error) {
      console.error("Error fetching placements:", error);
    } finally {
      setLoading(prev => ({ ...prev, placements: false }));
    }

    // Fetch academics
    try {
      setLoading(prev => ({ ...prev, academics: true }));
      const academicsRes = await api.get(`/mentor/students/${student._id}/academics`);
      setStudentData(prev => ({ ...prev, academics: academicsRes.data || { cgpa: 0, attendance: 0, backlogs: 0, marks: 0 } }));
    } catch (error) {
      console.error("Error fetching academics:", error);
    } finally {
      setLoading(prev => ({ ...prev, academics: false }));
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const totalRewardPoints = studentData.rewards.reduce((acc, r) => acc + r.points, 0);
  const pendingLeaves = studentData.leaves.filter(l => l.status === "pending" || l.status === "Pending").length;
  const approvedLeaves = studentData.leaves.filter(l => l.status === "approved" || l.status === "Approved");

  const usedLeaveDays = approvedLeaves.reduce((acc, l) => {
    const from = new Date(l.fromDate);
    const to = new Date(l.toDate);
    const diffDays = Math.ceil(Math.abs(to - from) / (1000 * 60 * 60 * 24)) + 1;
    return acc + diffDays;
  }, 0);

  const totalAllowedLeaves = studentData.academics.attendanceBasedLeaveQuota || studentData.academics.totalLeaves || 15;
  const remainingLeaves = totalAllowedLeaves - usedLeaveDays;

  const latestPlacement = studentData.placements[studentData.placements.length - 1];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Back Button */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          onClick={onBack}
          sx={{
            mr: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Student Profile
        </Typography>
      </Box>

      {/* Student Header Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: theme.palette.primary.main,
                fontSize: '2.5rem'
              }}
            >
              {student.name?.charAt(0)}   
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {student.name}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
              <Chip
                icon={<SchoolIcon />}
                label={`Year ${student.year}`}
                size="small"
                sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}
              />
              <Chip
                label={student.department}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<EmailIcon />}
                label={student.email}
                size="small"
                variant="outlined"
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<MessageIcon />}
                size="small"
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Message Student
              </Button>
              <Button
                variant="outlined"
                startIcon={<CalendarIcon />}
                size="small"
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Schedule Meeting
              </Button>
            </Box>
          </Grid>
          <Grid item>
            <Tooltip title="Overall Performance">
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: theme.palette.success.main, fontWeight: 700 }}>
                  {studentData.academics.cgpa}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Current CGPA
                </Typography>
              </Box>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
          }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }}>
                  <RewardIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>{totalRewardPoints}</Typography>
                  <Typography variant="body2" color="text.secondary">Reward Points</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
          }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                  <LeaveIcon />
                </Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>{remainingLeaves}</Typography>
                    <Typography variant="body2" color="text.secondary">/ {totalAllowedLeaves}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Days Remaining</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
          }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                  <PlacementIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {latestPlacement?.status || "No Application"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Placement Status</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 2,
            pt: 2
          }}
        >
          <Tab label="Academic Overview" icon={<SchoolIcon />} iconPosition="start" />
          <Tab label="Rewards" icon={<RewardIcon />} iconPosition="start" />
          <Tab label="Leave History" icon={<LeaveIcon />} iconPosition="start" />
          <Tab label="Placements" icon={<PlacementIcon />} iconPosition="start" />
        </Tabs>

        {/* Academic Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Academic Progress</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">CGPA</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(studentData.academics.cgpa / 10) * 100}
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2">{studentData.academics.cgpa}/10</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">Attendance</Typography>
                      <Chip
                        label={
                          studentData.academics.attendance >= 90 ? "Excellent" :
                          studentData.academics.attendance >= 75 ? "Good" :
                          studentData.academics.attendance >= 60 ? "Low" : "Critical"
                        }
                        size="small"
                        color={
                          studentData.academics.attendance >= 90 ? "success" :
                          studentData.academics.attendance >= 75 ? "primary" :
                          studentData.academics.attendance >= 60 ? "warning" : "error"
                        }
                        sx={{ fontWeight: 700, height: 20, fontSize: "0.68rem" }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={studentData.academics.attendance}
                        color={
                          studentData.academics.attendance >= 90 ? "success" :
                          studentData.academics.attendance >= 75 ? "primary" :
                          studentData.academics.attendance >= 60 ? "warning" : "error"
                        }
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" fontWeight={600}>{studentData.academics.attendance}%</Typography>
                    </Box>
                    {/* Quota explanation */}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                      Leave quota: {studentData.academics.attendanceBasedLeaveQuota ?? "—"} of {studentData.academics.totalLeaves ?? 15} days
                      {" (≥90%→max · ≥75%→80% · ≥60%→50% · <60%→25%)"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Backlogs</Typography>
                      <Typography variant="h6" color={studentData.academics.backlogs > 0 ? "error.main" : "text.primary"}>
                        {studentData.academics.backlogs}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color="text.secondary">Internal Marks</Typography>
                      <Typography variant="h6">{studentData.academics.marks}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Current Subjects</Typography>
                  <List dense>
                    {['Mathematics', 'Physics', 'Computer Science', 'English'].map((subject) => (
                      <ListItem key={subject}>
                        <ListItemIcon>
                          <BookIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={subject} />
                        <Chip label="In Progress" size="small" color="primary" variant="outlined" />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Rewards Tab */}
        <TabPanel value={tabValue} index={1}>
          {loading.rewards ? (
            <LinearProgress />
          ) : studentData.rewards.length === 0 ? (
            <Typography color="text.secondary" align="center">No rewards yet</Typography>
          ) : (
            <Grid container spacing={2}>
              {studentData.rewards.map((reward, index) => (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1">{reward.reason}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(reward.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip
                          label={`+${reward.points} points`}
                          color="success"
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Leave History Tab */}
        <TabPanel value={tabValue} index={2}>
          {loading.leaves ? (
            <LinearProgress />
          ) : studentData.leaves.length === 0 ? (
            <Typography color="text.secondary" align="center">No leave history</Typography>
          ) : (
            <Grid container spacing={2}>
              {studentData.leaves.map((leave, index) => (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1">{leave.reason}</Typography>
                        <Chip
                          label={leave.status}
                          size="small"
                          color={leave.status?.toLowerCase() === 'approved' ? 'success' : leave.status?.toLowerCase() === 'pending' ? 'warning' : 'error'}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {Math.ceil(Math.abs(new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)) + 1} days
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Placements Tab */}
        <TabPanel value={tabValue} index={3}>
          {loading.placements ? (
            <LinearProgress />
          ) : studentData.placements.length === 0 ? (
            <Typography color="text.secondary" align="center">No placement applications</Typography>
          ) : (
            <Grid container spacing={2}>
              {studentData.placements.map((placement, index) => (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1">{placement.company}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Applied: {new Date(placement.appliedDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip
                          label={placement.status}
                          size="small"
                          color={placement.status === 'selected' ? 'success' : placement.status === 'pending' ? 'warning' : 'default'}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
}