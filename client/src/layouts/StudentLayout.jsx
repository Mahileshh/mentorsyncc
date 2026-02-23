import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../pages/student/components/Sidebar";

function StudentLayout() {
  const isLoggedIn = localStorage.getItem("role") === "student";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default StudentLayout;