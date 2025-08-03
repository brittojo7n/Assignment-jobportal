import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Paper, Box, Modal, TextField, Alert } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [open, setOpen] = useState(false);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchJob = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/jobs/${id}`);
      setJob(res.data);
    };
    fetchJob();
  }, [id]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError('');
    setSuccess('');
  };

  const onFileChange = (e) => setResume(e.target.files[0]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      setError('Please upload your resume.');
      return;
    }
    const formData = new FormData();
    formData.append('resume', resume);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token } };
      await axios.post(`${process.env.REACT_APP_API_URL}/jobs/${id}/apply`, formData, config);
      setSuccess('Application submitted successfully!');
      setError('');
      setTimeout(handleClose, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to apply.');
      setSuccess('');
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

  if (!job) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>{job.title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', my: 1, color: 'text.secondary' }}>
          <BusinessIcon sx={{ mr: 1 }} />
          <Typography variant="h6">{job.company}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
          <LocationOnIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">{job.location}</Typography>
        </Box>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{job.description}</Typography>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleOpen} disabled={!token}>Apply Now</Button>
          <Button variant="outlined" sx={{ ml: 2 }} onClick={handleSaveJob} disabled={!token}>Save Job</Button>
          {!token && <Typography variant="caption" color="error" sx={{ ml: 2 }}>Please log in to apply or save jobs.</Typography>}
        </Box>
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