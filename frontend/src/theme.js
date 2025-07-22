import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#ffc069" },
    secondary: { main: "#b0c4de" },
    background: {
      default: "#282c34",
      paper: "rgba(44,44,64,0.85)"
    }
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
    h1: { fontWeight: 700 },
    h3: { fontWeight: 500 }
  },
  shape: {
    borderRadius: 16
  }
});

export default theme;