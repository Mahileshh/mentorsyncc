import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#3f51b5" },
    secondary: { main: "#009688" },
    background: { default: "#f5f7fa" }
  },
  shape: { borderRadius: 12 }
});

export default theme;
