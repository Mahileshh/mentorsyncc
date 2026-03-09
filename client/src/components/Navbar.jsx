import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* Left Side - App Name */}
        <Typography variant="h6">
          MentorSync
        </Typography>

        {/* Right Side - User Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {name && (
            <Typography variant="body1">
              {name} ({role})
            </Typography>
          )}

          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;