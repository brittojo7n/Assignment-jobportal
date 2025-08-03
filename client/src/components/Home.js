import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, CardActions, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';

const Home = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/jobs`);
        setJobs(res.data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Find Your Next Opportunity
      </Typography>
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item key={job.id} xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div">
                  {job.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', my: 1, color: 'text.secondary' }}>
                  <BusinessIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">{job.company}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                  <LocationOnIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">{job.location}</Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/jobs/${job.id}`} variant="contained">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;