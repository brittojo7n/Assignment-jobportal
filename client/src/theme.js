import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // This is the key to switch to dark mode
    primary: {
      main: '#38bdf8', // A vibrant, modern blue
    },
    secondary: {
      main: '#818cf8', // A complementary indigo
    },
    background: {
      default: '#111827', // The base background color
      // --- Glassmorphism Style for Paper/Cards ---
      paper: 'rgba(40, 48, 68, 0.6)', 
    },
    text: {
      primary: '#e5e7eb',
      secondary: '#9ca3af',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12, // A more rounded, modern look
  },
  components: {
    // --- Style for the Navbar ---
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(17, 24, 39, 0.7)', // Darker, semi-transparent background
          backdropFilter: 'blur(12px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    // --- Style for all Paper and Card components ---
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: '1px',
          borderStyle: 'solid',
          // The background color is inherited from palette.background.paper
        },
      },
    },
    // Ensure Cards have the same style
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(40, 48, 68, 0.6)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: '1px',
          borderStyle: 'solid',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 15px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;