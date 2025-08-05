import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Paper, List, ListItem, ListItemText, ListItemButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Link, CircularProgress, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminDashboard = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const token = localStorage.getItem('token');
  const config = { headers: { 'x-auth-token': token } };

  const fetchMyJobs = async () => {
    setIsJobsLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/jobs/my-jobs/all`, config);
      setMyJobs(res.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsJobsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMyJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      handleJobSelect(selectedJob);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };
  
  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to permanently delete this job posting?')) {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/jobs/${jobId}`, config);
            // Refresh the job list
            fetchMyJobs();
            // If the deleted job was the one selected, clear the right panel
            if (selectedJob?.id === jobId) {
                setSelectedJob(null);
                setApplicants([]);
            }
        } catch (err) {
            alert('Failed to delete job posting.');
        }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Recruiter Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>My Job Postings</Typography>
          <Paper>
            {isJobsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
            ) : myJobs.length === 0 ? (
              <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                You have not posted any jobs yet.
              </Typography>
            ) : (
              <List component="nav">
                {myJobs.map((job) => (
                  <ListItem
                    key={job.id}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteJob(job.id)} title="Delete Job Posting">
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemButton selected={selectedJob?.id === job.id} onClick={() => handleJobSelect(job)}>
                      <ListItemText primary={job.title} secondary={`${job.applicationCount} Applications`} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedJob ? (
            <Box>
              <Typography variant="h6" gutterBottom>Applicants for: {selectedJob.title}</Typography>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Applicant</TableCell><TableCell>Email</TableCell><TableCell>Resume</TableCell><TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {applicants.length > 0 ? applicants.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell>{`${app.User.firstName} ${app.User.lastName}`}</TableCell>
                          <TableCell>{app.User.email}</TableCell>
                          <TableCell>{app.Resume ? (<Link href={`http://localhost:5000/${app.Resume.path}`} target="_blank" rel="noopener noreferrer">Download</Link>) : ('N/A')}</TableCell>
                          <TableCell>
                            <Select value={app.status} onChange={(e) => handleStatusChange(app.id, e.target.value)} size="small" sx={{ minWidth: 120 }}>
                              <MenuItem value="pending">Pending</MenuItem><MenuItem value="shortlisted">Shortlisted</MenuItem><MenuItem value="rejected">Rejected</MenuItem>
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
            <Paper sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" color="text.secondary">Select a job posting from the left to view applicants.</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;