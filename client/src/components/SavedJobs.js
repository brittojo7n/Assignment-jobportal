import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, List, ListItem, ListItemText, IconButton, Divider, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteIcon from '@mui/icons-material/Delete';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/jobs/saved/me`, config);
        setSavedJobs(res.data);
      } catch (error) {
        console.error("Failed to fetch saved jobs:", error);
      }
    };
    if (token) fetchSavedJobs();
  }, [token]);

  const handleDelete = async (savedJobId) => {
    if (window.confirm('Are you sure you want to remove this job?')) {
      try {
        const config = { headers: { 'x-auth-token': token } };
        await axios.delete(`${process.env.REACT_APP_API_URL}/jobs/saved/${savedJobId}`, config);
        setSavedJobs(savedJobs.filter((saved) => saved.id !== savedJobId));
      } catch (error) {
        alert('Could not remove job.');
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Saved Jobs</Typography>
      <Paper>
        <List>
          {savedJobs.map((saved, index) => (
            <React.Fragment key={saved.id}>
              <ListItem secondaryAction={
                <Stack direction="row" spacing={1}>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(saved.id)} title="Remove Saved Job"><DeleteIcon /></IconButton>
                  <IconButton edge="end" aria-label="view" component={Link} to={`/jobs/${saved.Job.id}`} title="View Job Details"><ArrowForwardIosIcon /></IconButton>
                </Stack>
              }>
                <ListItemText primary={saved.Job.title} secondary={`${saved.Job.company} - ${saved.Job.location}`} />
              </ListItem>
              {index < savedJobs.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default SavedJobs;