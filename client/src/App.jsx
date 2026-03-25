import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import MentorLayout from "./layouts/MentorLayout";
import StudentLayout from "./layouts/StudentLayout";
import MentorDashboard from "./pages/mentor/Dashboard";
import Students from "./pages/mentor/Students";
import LeaveRequests from "./pages/mentor/LeaveRequests";
import PlacementRequests from "./pages/mentor/PlacementRequests";
import RewardPoints from "./pages/mentor/RewardPoints";
import MentorCourseExemptions from "./pages/mentor/CourseExemptions";
import StudentDashboard from "./pages/student/Dashboard";
import ApplyLeave from "./pages/student/ApplyLeave";
import LeaveHistory from "./pages/student/LeaveHistory";
import PlacementRequest from "./pages/student/PlacementRequest";
import MyRewards from "./pages/student/MyRewards";
import StudentCourseExemptions from "./pages/student/CourseExemptions";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Mentor */}
      <Route element={<ProtectedRoute role="mentor" />}>
        <Route path="/mentor" element={<MentorLayout />}>
          <Route index element={<MentorDashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="leaves" element={<LeaveRequests />} />
          <Route path="placements" element={<PlacementRequests />} />
          <Route path="rewards" element={<RewardPoints />} />
          <Route path="exemptions" element={<MentorCourseExemptions />} />
        </Route>
      </Route>

      {/* Student */}
      <Route element={<ProtectedRoute role="student" />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="apply-leave" element={<ApplyLeave />} />
          <Route path="leave-history" element={<LeaveHistory />} />
          <Route path="placement" element={<PlacementRequest />} />
          <Route path="rewards" element={<MyRewards />} />
          <Route path="exemptions" element={<StudentCourseExemptions />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
