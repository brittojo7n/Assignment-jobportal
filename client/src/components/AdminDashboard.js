import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Link } from '@mui/material';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem('token');

  const fetchApplications = async () => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/applications`, config);
      setApplications(res.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchApplications();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleStatusChange = async (appId, status) => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      await axios.put(`${process.env.REACT_APP_API_URL}/applications/${appId}/status`, { status }, config);
      fetchApplications();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Recruiter Dashboard</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Job Title</TableCell>
              <TableCell>Applicant</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Resume</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.Job.title}</TableCell>
                <TableCell>{`${app.User.firstName} ${app.User.lastName}`}</TableCell>
                <TableCell>{app.User.email}</TableCell>
                <TableCell>
                  {app.Resume ? (
                    <Link href={`http://localhost:5000/${app.Resume.path}`} target="_blank" rel="noopener noreferrer">
                      Download
                    </Link>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="shortlisted">Shortlisted</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminDashboard;