import { useEffect, useState } from "react";
import {
  Typography,
  Table, TableHead, TableRow,
  TableCell, TableBody, Paper,
  Box,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  TablePagination,
  TableContainer,
  Tooltip,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Skeleton,
  Alert,
  Button,
  Menu,
  MenuItem,
  LinearProgress
} from "@mui/material";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  MoreVert as MoreIcon,
  Visibility as ViewIcon,
  Message as MessageIcon,
  TrendingUp as TrendingIcon,
  Group as GroupIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import StudentDetails from "./StudentDetails";

export default function Students() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);

  // Filters state
  const [yearFilter, setYearFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = students;

    // Apply search
    if (searchTerm) {
      result = result.filter(student => 
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply year filter
    if (yearFilter !== "all") {
      result = result.filter(student => student.year === yearFilter);
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      result = result.filter(student => student.department === departmentFilter);
    }

    setFilteredStudents(result);
    setPage(0);
  }, [searchTerm, yearFilter, departmentFilter, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/mentor/mentorstudents");
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch (err) {
      setError("Failed to load students. Please try again.");
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, student) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const handleViewStudent = (student) => {
    setViewingStudent(student);
    handleMenuClose();
  };

  const handleMessageStudent = () => {
    // Navigate to messaging or open dialog
    console.log("Message student:", selectedStudent);
    handleMenuClose();
    // You can implement messaging feature here
  };

  const handleRowClick = (student) => {
    setViewingStudent(student);
  };

  const handleBackToList = () => {
    setViewingStudent(null);
  };

  // Get unique years and departments for filters
  const years = [...new Set(students.map(s => s.year).filter(Boolean))];
  const departments = [...new Set(students.map(s => s.department).filter(Boolean))];

  // Calculate statistics
  const totalStudents = students.length;
  const averageYear = students.length > 0 
    ? (students.reduce((acc, s) => acc + (parseInt(s.year) || 0), 0) / students.length).toFixed(1)
    : 0;
  const departmentCount = departments.length;

  // If viewing a student, show their details
  if (viewingStudent) {
    return <StudentDetails student={viewingStudent} onBack={handleBackToList} />;
  }

  // Loading skeletons
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={300} height={40} sx={{ mb: 3 }} />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} md={4} key={i}>
              <Skeleton variant="rounded" height={100} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rounded" height={400} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            My Students
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and monitor your assigned students
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchStudents}
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ 
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.2), color: theme.palette.primary.main }}>
                <GroupIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>{totalStudents}</Typography>
                <Typography variant="body2" color="text.secondary">Total Students</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ 
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.light, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
          }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.2), color: theme.palette.success.main }}>
                <SchoolIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>{averageYear}</Typography>
                <Typography variant="body2" color="text.secondary">Average Year</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ 
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
          }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.2), color: theme.palette.info.main }}>
                <TrendingIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>{departmentCount}</Typography>
                <Typography variant="body2" color="text.secondary">Departments</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters Section */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
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
              label="Year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              SelectProps={{
                sx: { borderRadius: 2 }
              }}
            >
              <MenuItem value="all">All Years</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year}>Year {year}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Department"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              SelectProps={{
                sx: { borderRadius: 2 }
              }}
            >
              <MenuItem value="all">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={1}>
            <Tooltip title="Export to CSV">
              <IconButton sx={{ color: theme.palette.primary.main }}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Students Table */}
      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{ 
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: "hidden"
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
              <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Year</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Attendance</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <Typography variant="body1" color="text.secondary">
                    No students found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {searchTerm || yearFilter !== "all" || departmentFilter !== "all" 
                      ? "Try adjusting your filters" 
                      : "You haven't been assigned any students yet"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student) => (
                <TableRow 
                  key={student._id}
                  onClick={() => handleRowClick(student)}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.primary.main, 0.02),
                      cursor: 'pointer'
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40,
                          bgcolor: theme.palette.primary.main,
                          fontSize: '1rem'
                        }}
                      >
                        {student.name?.charAt(0) || <PersonIcon />}
                      </Avatar>
                      <Typography sx={{ fontWeight: 500 }}>{student.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2">{student.email}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`Year ${student.year}`}
                      size="small"
                      sx={{ 
                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={student.department}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  {/* Attendance column */}
                  <TableCell sx={{ minWidth: 130 }}>
                    {(() => {
                      const att = student.attendance ?? 75;
                      const tier =
                        att >= 90 ? { label: "Excellent", color: "#16A34A", bg: "#F0FDF4", bar: "success" } :
                        att >= 75 ? { label: "Good",      color: "#4F46E5", bg: "#EEF2FF", bar: "primary" } :
                        att >= 60 ? { label: "Low",       color: "#D97706", bg: "#FFFBEB", bar: "warning" } :
                                   { label: "Critical",   color: "#DC2626", bg: "#FEF2F2", bar: "error"   };
                      return (
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.4 }}>
                            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: tier.color }}>
                              {att}%
                            </Typography>
                            <Chip
                              label={tier.label}
                              size="small"
                              sx={{ bgcolor: tier.bg, color: tier.color, fontWeight: 700, fontSize: "0.62rem", height: 18, px: 0.25 }}
                            />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(att, 100)}
                            color={tier.bar}
                            sx={{ height: 4, borderRadius: 99, bgcolor: tier.bg }}
                          />
                        </Box>
                      );
                    })()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small"
                      onClick={(e) => handleMenuOpen(e, student)}
                    >
                      <MoreIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredStudents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}
        />
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2, minWidth: 180 }
        }}
      >
        <MenuItem onClick={() => handleViewStudent(selectedStudent)}>
          <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}>
            <ViewIcon fontSize="small" />
          </Box>
          <Typography variant="body2">View Details</Typography>
        </MenuItem>
        <MenuItem onClick={handleMessageStudent}>
          <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}>
            <MessageIcon fontSize="small" />
          </Box>
          <Typography variant="body2">Send Message</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}