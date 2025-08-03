import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import theme from './theme';

import Navbar from './components/Navbar';
import Home from './components/Home';
import JobDetail from './components/JobDetail';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import MyApplications from './components/MyApplications';
import SavedJobs from './components/SavedJobs';
import PostJob from './components/PostJob';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container component="main" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<PrivateRoute allowedRoles={['applicant']} />}>
              <Route path="/my-applications" element={<MyApplications />} />
              <Route path="/saved-jobs" element={<SavedJobs />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={['recruiter']} />}>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/post-job" element={<PostJob />} />
            </Route>
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;