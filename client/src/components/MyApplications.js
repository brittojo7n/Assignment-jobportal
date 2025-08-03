import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip, Divider } from '@mui/material';

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
    if (token) {
      fetchApplications();
    }
  }, [token]);

  const getStatusChip = (status) => {
    switch (status) {
      case 'shortlisted':
        return <Chip label="Shortlisted" color="success" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" />;
      default:
        return <Chip label="Pending" color="warning" />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>My Applications</Typography>
      <Paper>
        <List>
          {applications.map((app, index) => (
            <React.Fragment key={app.id}>
              <ListItem secondaryAction={getStatusChip(app.status)}>
                <ListItemText
                  primary={app.Job.title}
                  secondary={`${app.Job.company} - ${app.Job.location}`}
                />
              </ListItem>
              {index < applications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default MyApplications;