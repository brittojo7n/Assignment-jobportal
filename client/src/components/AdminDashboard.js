import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Paper, List, ListItemButton, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Link, CircularProgress } from '@mui/material';

const AdminDashboard = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  const config = { headers: { 'x-auth-token': token } };

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/jobs/my-jobs/all`, config);
        setMyJobs(res.data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };
    if (token) {
      fetchMyJobs();
    }
  }, [token]);

  const handleJobSelect = async (job) => {
    setSelectedJob(job);
    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/applications/job/${job.id}`, config);
      setApplicants(res.data);
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
      setApplicants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/applications/${appId}/status`, { status }, config);
      // Refresh applicants for the selected job to show the new status
      handleJobSelect(selectedJob);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Recruiter Dashboard</Typography>
      <Grid container spacing={3}>
        {/* Left Panel: My Job Postings */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>My Job Postings</Typography>
          <Paper>
            <List component="nav">
              {myJobs.map((job) => (
                <ListItemButton
                  key={job.id}
                  selected={selectedJob?.id === job.id}
                  onClick={() => handleJobSelect(job)}
                >
                  <ListItemText
                    primary={job.title}
                    secondary={`${job.applicationCount} Applications`}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Right Panel: Applicants for Selected Job */}
        <Grid item xs={12} md={8}>
          {selectedJob ? (
            <Box>
              <Typography variant="h6" gutterBottom>Applicants for: {selectedJob.title}</Typography>
              {isLoading ? (
                <CircularProgress />
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Applicant</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Resume</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {applicants.length > 0 ? applicants.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell>{`${app.User.firstName} ${app.User.lastName}`}</TableCell>
                          <TableCell>{app.User.email}</TableCell>
                          <TableCell>
                            {app.Resume ? (
                              <Link href={`http://localhost:5000/${app.Resume.path}`} target="_blank" rel="noopener noreferrer">Download</Link>
                            ) : ('N/A')}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, e.target.value)}
                              size="small" sx={{ minWidth: 120 }}
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="shortlisted">Shortlisted</MenuItem>
                              <MenuItem value="rejected">Rejected</MenuItem>
                            </Select>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">No applicants for this job yet.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">Select a job posting from the left to view applicants.</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;