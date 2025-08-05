import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Paper, Box, Modal, TextField, Alert, Stack } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import { jwtDecode } from 'jwt-decode';

// Updated modalStyle to match the new theme
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'rgba(30, 41, 59, 0.8)', // Semi-transparent dark background
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: 24,
  p: 4,
  borderRadius: 3, // Corresponds to shape.borderRadius in theme
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try { setUser(jwtDecode(token).user); } catch (e) { setUser(null); }
    }
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        navigate('/');
      }
    };
    fetchJob();
  }, [id, token, navigate]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setError(''); setSuccess(''); };
  const onFileChange = (e) => setResume(e.target.files[0]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) { setError('Please upload your resume.'); return; }
    const formData = new FormData();
    formData.append('resume', resume);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token } };
      await axios.post(`${process.env.REACT_APP_API_URL}/jobs/${id}/apply`, formData, config);
      setSuccess('Application submitted successfully!');
      setTimeout(handleClose, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to apply.');
    }
  };

  const handleSaveJob = async () => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      await axios.post(`${process.env.REACT_APP_API_URL}/jobs/${id}/save`, {}, config);
      alert('Job saved!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to save job.');
    }
  };

  const handleDeleteJob = async () => {
    if (window.confirm('Are you sure you want to permanently delete this job posting?')) {
      try {
        const config = { headers: { 'x-auth-token': token } };
        await axios.delete(`${process.env.REACT_APP_API_URL}/jobs/${id}`, config);
        alert('Job posting deleted.');
        navigate('/');
      } catch (err) {
        alert('Failed to delete job posting.');
      }
    }
  };

  if (!job) return <Typography>Loading...</Typography>;

  const isOwner = user && user.role === 'recruiter' && user.id === job.recruiterId;

  return (
    <Container>
      <Paper sx={{ p: 4, mt: 4, backgroundColor: 'transparent' }}>
        <Typography variant="h4" gutterBottom>{job.title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', my: 1, color: 'text.secondary' }}><BusinessIcon sx={{ mr: 1 }} /><Typography variant="h6">{job.company}</Typography></Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}><LocationOnIcon sx={{ mr: 1 }} /><Typography variant="subtitle1">{job.location}</Typography></Box>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{job.description}</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          {user && user.role === 'applicant' && (
            <><Button variant="contained" onClick={handleOpen}>Apply Now</Button><Button variant="outlined" onClick={handleSaveJob}>Save Job</Button></>
          )}
          {isOwner && (<Button variant="contained" color="error" onClick={handleDeleteJob}>Delete Posting</Button>)}
        </Stack>
        {!user && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>Please log in to apply or save jobs.</Typography>}
      </Paper>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle} component="form" onSubmit={handleApply}>
          <Typography variant="h6" component="h2">Apply for {job.title}</Typography>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <TextField type="file" fullWidth margin="normal" onChange={onFileChange} required inputProps={{ accept: '.pdf,.doc,.docx' }} />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Submit Application</Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default JobDetail;