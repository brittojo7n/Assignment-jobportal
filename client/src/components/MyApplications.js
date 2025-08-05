import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip, Divider, IconButton, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/applications/me`, config);
        setApplications(res.data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };
    if (token) fetchApplications();
  }, [token]);

  const handleWithdraw = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      try {
        const config = { headers: { 'x-auth-token': token } };
        await axios.delete(`${process.env.REACT_APP_API_URL}/applications/${applicationId}`, config);
        setApplications(applications.filter((app) => app.id !== applicationId));
      } catch (error) {
        alert('Could not withdraw application. Please try again.');
      }
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'shortlisted': return <Chip label="Shortlisted" color="success" size="small" />;
      case 'rejected': return <Chip label="Rejected" color="error" size="small" />;
      default: return <Chip label="Pending" color="warning" size="small" />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>My Applications</Typography>
      <Paper>
        {applications.length === 0 ? (
          <Typography sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            You have not applied to any jobs yet.
          </Typography>
        ) : (
          <List>
            {applications.map((app, index) => (
              <React.Fragment key={app.id}>
                <ListItem
                  secondaryAction={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {getStatusChip(app.status)}
                      <IconButton edge="end" aria-label="withdraw" onClick={() => handleWithdraw(app.id)} title="Withdraw Application"><DeleteIcon /></IconButton>
                      <IconButton edge="end" aria-label="view job" component={Link} to={`/jobs/${app.JobId}`} title="View Job Details"><ArrowForwardIosIcon /></IconButton>
                    </Stack>
                  }
                >
                  <ListItemText primary={app.Job.title} secondary={`${app.Job.company} - ${app.Job.location}`} />
                </ListItem>
                {index < applications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default MyApplications;