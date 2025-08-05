import { createTheme } from '@mui/material/styles';

 const theme = createTheme({
   palette: {
     mode: 'dark', // Dark mode
     primary: {
       main: '#38bdf8', // Vibrant blue
     },
     secondary: {
       main: '#818cf8', // Complementary indigo
     },
     background: {
       default: '#111827',
       paper: 'rgba(40, 48, 68, 0.6)', // Glassmorphism background
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
     borderRadius: 12,
   },
   components: {
     MuiAppBar: {
       styleOverrides: {
         root: {
           backgroundColor: 'rgba(17, 24, 39, 0.7)', // Darker, semi-transparent navbar
           backdropFilter: 'blur(12px)',
           boxShadow: 'none',
           borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
         },
       },
     },
     MuiPaper: {
       styleOverrides: {
         root: {
           backdropFilter: 'blur(12px)',
           borderColor: 'rgba(255, 255, 255, 0.1)',
           borderWidth: '1px',
           borderStyle: 'solid',
         },
       },
     },
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
             boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)', // Subtle white glow on card hover
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
           transition: 'box-shadow 0.2s ease-in-out',
           '&:hover': {
             boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)', // Subtle white glow on button hover
           },
         },
       },
     },
   },
 });

 export default theme;