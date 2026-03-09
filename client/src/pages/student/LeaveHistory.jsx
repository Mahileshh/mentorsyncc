import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  alpha,
  Skeleton,
  Alert,
  TablePagination,
  Tooltip,
  Button,
  Stack,
  LinearProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Event as EventIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Cancel as RejectedIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  AccessTime as TimeIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon
} from "@mui/icons-material";
import api from "../../services/api";

export default function LeaveHistory() {
  const theme = useTheme();
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalDays: 0
  });

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...leaves];

    // Apply search
    if (searchTerm) {
      result = result.filter(leave => 
        leave.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(leave => leave.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch(dateFilter) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          result = result.filter(leave => new Date(leave.fromDate) >= filterDate);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          result = result.filter(leave => new Date(leave.fromDate) >= filterDate);
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          result = result.filter(leave => new Date(leave.fromDate) >= filterDate);
          break;
      }
    }

    // Sort by date (most recent first)
    result.sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate));

    setFilteredLeaves(result);
    setPage(0);
  }, [searchTerm, statusFilter, dateFilter, leaves]);

  const fetchLeaveHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/leaverequests/my-leaves");
      setLeaves(res.data);
      calculateStats(res.data);
    } catch (err) {
      setError("Failed to load leave history");
      console.error("Error fetching leave history:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (leaveData) => {
    const total = leaveData.length;
    const approved = leaveData.filter(l => l.status === "approved").length;
    const pending = leaveData.filter(l => l.status === "pending").length;
    const rejected = leaveData.filter(l => l.status === "rejected").length;
    
    // Calculate total leave days
    const totalDays = leaveData.reduce((acc, leave) => {
      if (leave.status === "approved") {
        const from = new Date(leave.fromDate);
        const to = new Date(leave.toDate);
        const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
        return acc + days;
      }
      return acc;
    }, 0);

    setStats({ total, approved, pending, rejected, totalDays });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "approved":
        return <ApprovedIcon sx={{ color: theme.palette.success.main }} />;
      case "pending":
        return <PendingIcon sx={{ color: theme.palette.warning.main }} />;
      case "rejected":
        return <RejectedIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "approved": return "success";
      case "pending": return "warning";
      case "rejected": return "error";
      default: return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDays = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    setDetailsOpen(true);
  };

  const handleRefresh = () => {
    fetchLeaveHistory();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={300} height={40} sx={{ mb: 3 }} />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rounded" height={400} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              width: 56,
              height: 56
            }}
          >
            <HistoryIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Leave History
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and track all your leave applications
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ 
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            bgcolor: alpha(theme.palette.info.main, 0.02)
          }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>{stats.total}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Applications</Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                  <EventIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ 
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            bgcolor: alpha(theme.palette.success.main, 0.02)
          }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                    {stats.approved}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Approved</Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                  <ApprovedIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ 
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            bgcolor: alpha(theme.palette.warning.main, 0.02)
          }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                    {stats.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Pending</Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }}>
                  <PendingIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ 
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            bgcolor: alpha(theme.palette.primary.main, 0.02)
          }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    {stats.totalDays}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Total Days</Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  <CalendarIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Leave Balance Progress */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          bgcolor: alpha(theme.palette.background.paper, 0.5)
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Leave Utilization</Typography>
          <Typography variant="body2" fontWeight={600}>
            {stats.totalDays} / 20 days used
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={(stats.totalDays / 20) * 100} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              bgcolor: theme.palette.primary.main,
              borderRadius: 4
            }
          }}
        />
      </Paper>

      {/* Filters */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          
          <Grid item xs={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              SelectProps={{ sx: { borderRadius: 2 } }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Time Period"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              SelectProps={{ sx: { borderRadius: 2 } }}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 30 Days</MenuItem>
              <MenuItem value="quarter">Last 3 Months</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary" align="right">
              {filteredLeaves.length} {filteredLeaves.length === 1 ? 'record' : 'records'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Leave History Table */}
      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{ 
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: "hidden"
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>From Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>To Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredLeaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <HistoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                    <Typography variant="body1" color="text.secondary">
                      No leave records found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                        ? "Try adjusting your filters"
                        : "You haven't applied for any leaves yet"}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredLeaves
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((leave) => (
                <TableRow 
                  key={leave._id}
                  sx={{ 
                    '&:hover': { 
                      bgcolor: alpha(theme.palette.primary.main, 0.02)
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      {formatDate(leave.fromDate)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      {formatDate(leave.toDate)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {leave.reason}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={`${calculateDays(leave.fromDate, leave.toDate)} days`}
                      sx={{ 
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      icon={getStatusIcon(leave.status)}
                      label={leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      color={getStatusColor(leave.status)}
                      variant="filled"
                      sx={{ 
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small"
                        onClick={() => handleViewDetails(leave)}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredLeaves.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}
        />
      </TableContainer>

      {/* Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        {selectedLeave && (
          <>
            <DialogTitle sx={{ 
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              pb: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DescriptionIcon color="primary" />
                <Typography variant="h6">Leave Application Details</Typography>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Duration"
                    secondary={`${formatDate(selectedLeave.fromDate)} - ${formatDate(selectedLeave.toDate)}`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <TimeIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Total Days"
                    secondary={`${calculateDays(selectedLeave.fromDate, selectedLeave.toDate)} days`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    {getStatusIcon(selectedLeave.status)}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Status"
                    secondary={
                      <Chip
                        size="small"
                        label={selectedLeave.status}
                        color={getStatusColor(selectedLeave.status)}
                        sx={{ mt: 0.5 }}
                      />
                    }
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <DescriptionIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Reason"
                    secondary={selectedLeave.reason}
                  />
                </ListItem>

                {selectedLeave.appliedDate && (
                  <ListItem>
                    <ListItemIcon>
                      <CalendarIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Applied On"
                      secondary={formatDate(selectedLeave.appliedDate)}
                    />
                  </ListItem>
                )}

                {selectedLeave.processedDate && (
                  <ListItem>
                    <ListItemIcon>
                      <ApprovedIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Processed On"
                      secondary={formatDate(selectedLeave.processedDate)}
                    />
                  </ListItem>
                )}

                {selectedLeave.comments && (
                  <ListItem>
                    <ListItemIcon>
                      <DescriptionIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Comments"
                      secondary={selectedLeave.comments}
                    />
                  </ListItem>
                )}
              </List>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Button 
                onClick={() => setDetailsOpen(false)}
                variant="contained"
                sx={{ borderRadius: 2 }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}