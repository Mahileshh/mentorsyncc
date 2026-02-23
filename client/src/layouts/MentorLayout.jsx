import { Outlet, Link } from "react-router-dom";
import { Box, Drawer, List, ListItemButton, ListItemText, AppBar, Toolbar, Typography } from "@mui/material";

export default function MentorLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">Mentor Dashboard</Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: 240 }}>
        <Toolbar />
        <List>
          <ListItemButton component={Link} to="/mentor">
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton component={Link} to="/mentor/students">
            <ListItemText primary="My Students" />
          </ListItemButton>
          <ListItemButton component={Link} to="/mentor/leaves">
            <ListItemText primary="Leave Requests" />
          </ListItemButton>
          <ListItemButton component={Link} to="/mentor/placements">
            <ListItemText primary="Placement Requests" />
          </ListItemButton>
          <ListItemButton component={Link} to="/mentor/rewards">
            <ListItemText primary="Reward Points" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
