import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4F46E5",
      light: "#818CF8",
      dark: "#3730A3",
      contrastText: "#fff",
    },
    secondary: {
      main: "#0EA5E9",
      light: "#38BDF8",
      dark: "#0284C7",
    },
    success: {
      main: "#16A34A",
      light: "#4ADE80",
      dark: "#15803D",
    },
    warning: {
      main: "#D97706",
      light: "#FCD34D",
      dark: "#B45309",
    },
    error: {
      main: "#DC2626",
      light: "#F87171",
      dark: "#B91C1C",
    },
    info: {
      main: "#0EA5E9",
      light: "#38BDF8",
      dark: "#0284C7",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
      disabled: "#94A3B8",
    },
    divider: "#E2E8F0",
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: { fontWeight: 800, letterSpacing: "-0.025em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.015em" },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 600, letterSpacing: "-0.005em" },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500, fontSize: "0.8rem" },
    body1: { fontSize: "0.9rem", lineHeight: 1.6 },
    body2: { fontSize: "0.82rem", lineHeight: 1.55 },
    button: { fontWeight: 600, letterSpacing: "0.01em" },
    caption: { fontSize: "0.73rem", color: "#64748B" },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0 1px 2px rgba(15,23,42,0.04)",
    "0 1px 4px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
    "0 4px 8px rgba(15,23,42,0.06), 0 2px 4px rgba(15,23,42,0.04)",
    "0 8px 16px rgba(15,23,42,0.06), 0 4px 8px rgba(15,23,42,0.04)",
    "0 12px 24px rgba(15,23,42,0.08), 0 4px 8px rgba(15,23,42,0.04)",
    "0 16px 32px rgba(15,23,42,0.08), 0 8px 16px rgba(15,23,42,0.04)",
    "0 20px 40px rgba(15,23,42,0.1)",
    "0 24px 48px rgba(15,23,42,0.1)",
    "0 28px 56px rgba(15,23,42,0.12)",
    "0 32px 64px rgba(15,23,42,0.12)",
    "0 36px 72px rgba(15,23,42,0.14)",
    "0 40px 80px rgba(15,23,42,0.14)",
    "0 44px 88px rgba(15,23,42,0.16)",
    "0 48px 96px rgba(15,23,42,0.16)",
    "0 52px 104px rgba(15,23,42,0.18)",
    "0 56px 112px rgba(15,23,42,0.18)",
    "0 60px 120px rgba(15,23,42,0.2)",
    "0 64px 128px rgba(15,23,42,0.2)",
    "0 68px 136px rgba(15,23,42,0.22)",
    "0 72px 144px rgba(15,23,42,0.22)",
    "0 76px 152px rgba(15,23,42,0.24)",
    "0 80px 160px rgba(15,23,42,0.24)",
    "0 84px 168px rgba(15,23,42,0.26)",
    "0 88px 176px rgba(15,23,42,0.26)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        *, *::before, *::after { box-sizing: border-box; }
        body { -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.855rem",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        contained: {
          "&:hover": { boxShadow: "none" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: "1px solid #E2E8F0",
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 6,
            fontSize: "0.875rem",
            backgroundColor: "#fff",
            "& fieldset": { borderColor: "#E2E8F0" },
            "&:hover fieldset": { borderColor: "#94A3B8" },
            "&.Mui-focused fieldset": { borderColor: "#4F46E5", borderWidth: 1.5 },
          },
          "& label": { fontSize: "0.875rem" },
          "& label.Mui-focused": { color: "#4F46E5" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          fontWeight: 600,
          fontSize: "0.73rem",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            backgroundColor: "#F8FAFC",
            fontWeight: 600,
            fontSize: "0.75rem",
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            borderBottom: "1px solid #E2E8F0",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #F1F5F9",
          fontSize: "0.855rem",
          padding: "12px 16px",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "#E2E8F0" },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8, fontSize: "0.855rem" },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: { borderRadius: 6, fontSize: "0.875rem" },
      },
    },
  },
});

export default theme;
