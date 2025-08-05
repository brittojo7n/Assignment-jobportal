import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, CardActions, Box, TextField, InputAdornment, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/jobs`);
        setJobs(res.data);
        setFilteredJobs(res.data); // Initialize filtered list with all jobs
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const results = jobs.filter(job =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredJobs(results);
  }, [searchQuery, jobs]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Find Your Next Opportunity
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by job title, company, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Grid container spacing={3}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
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
          ))
        ) : (
          <Grid item xs={12}>
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 5 }}>
              No jobs found matching your search.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Home;