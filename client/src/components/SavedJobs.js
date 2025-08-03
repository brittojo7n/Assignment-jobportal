import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
    if (token) {
      fetchSavedJobs();
    }
  }, [token]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Saved Jobs</Typography>
      <Paper>
        <List>
          {savedJobs.map((saved, index) => (
            <React.Fragment key={saved.id}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" component={Link} to={`/jobs/${saved.Job.id}`}>
                    <ArrowForwardIosIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={saved.Job.title}
                  secondary={`${saved.Job.company} - ${saved.Job.location}`}
                />
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