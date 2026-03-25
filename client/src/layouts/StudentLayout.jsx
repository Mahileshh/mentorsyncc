import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

const PAGE_TITLES = {
  "/student": "Dashboard",
  "/student/apply-leave": "Apply Leave",
  "/student/leave-history": "Leave History",
  "/student/placement": "Placement Request",
  "/student/rewards": "My Rewards",
  "/student/exemptions": "Course Exemptions",
};

function StudentLayout() {
  const isLoggedIn = localStorage.getItem("role") === "student";
  const location = useLocation();
  const studentName = localStorage.getItem("name") || "Student";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Dashboard";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <Sidebar />

      <Box
        component="main"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}
      >
        {/* Top bar */}
        <Box
          sx={{
            px: { xs: 3, md: 4 },
            py: 1.75,
            bgcolor: "#fff",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#0F172A" }}>
              {pageTitle}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8" }}>
              Welcome back, {studentName}
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: { xs: 2.5, md: 3.5 }, maxWidth: 1200, width: "100%" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default StudentLayout;