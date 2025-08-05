import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WorkIcon from '@mui/icons-material/Work';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp * 1000 > new Date().getTime()) {
          setUser(decodedUser.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (e) {
        setUser(null);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    window.location.reload();
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <WorkIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Job Portal
        </Typography>
        <Box>
          {user ? (
            <>
              {user.role === 'recruiter' && (
                <>
                  <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                  <Button color="inherit" component={Link} to="/post-job">Post Job</Button>
                </>
              )}
              {user.role === 'applicant' && (
                <>
                  <Button color="inherit" component={Link} to="/my-applications">My Applications</Button>
                  <Button color="inherit" component={Link} to="/saved-jobs">Saved Jobs</Button>
                </>
              )}
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;