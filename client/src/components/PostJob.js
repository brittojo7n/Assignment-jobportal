import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';

const PostJob = () => {
  const [formData, setFormData] = useState({ title: '', company: '', location: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const { title, company, location, description } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const config = { headers: { 'x-auth-token': token } };
      await axios.post(`${process.env.REACT_APP_API_URL}/jobs`, formData, config);
      setSuccess('Job posted successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to post job.');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Post a New Job
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={onSubmit}>
          <TextField
            label="Job Title"
            name="title"
            value={title}
            onChange={onChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Company Name"
            name="company"
            value={company}
            onChange={onChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Location (e.g., City, State or Remote)"
            name="location"
            value={location}
            onChange={onChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Job Description"
            name="description"
            value={description}
            onChange={onChange}
            fullWidth
            required
            multiline
            rows={10}
            margin="normal"
          />
          <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }}>
            Post Job
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PostJob;