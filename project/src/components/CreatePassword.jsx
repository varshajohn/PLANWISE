import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Paper, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [snack, setSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('success');

  const navigate = useNavigate();
  const name = localStorage.getItem('loggedInMember')?.trim();

  useEffect(() => {
    if (!name) navigate('/');
  }, [name, navigate]);

  const handleCreate = () => {
    if (password !== confirmPassword) {
      setSnackMessage('Passwords do not match');
      setSnackSeverity('error');
      setSnack(true);
      return;
    }

    if (!securityAnswer.trim()) {
      setSnackMessage('Please provide an answer to the security question');
      setSnackSeverity('warning');
      setSnack(true);
      return;
    }

    axios.post("http://localhost:5000/teammembers/create-password", {
      name,
      password,
      securityAnswer: securityAnswer.trim().toLowerCase()
    })
      .then(() => {
        setSnackMessage('Password set successfully. You can now log in.');
        setSnackSeverity('success');
        setSnack(true);
        setTimeout(() => navigate('/'), 2000);
      })
      .catch((err) => {
        console.error("Failed to set password:", err.response?.data || err.message);
        setSnackMessage('Failed to set password. Try again.');
        setSnackSeverity('error');
        setSnack(true);
      });
  };

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#f0f4ff'
    }}>
      <Paper elevation={4} sx={{ p: 4, width: 360, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create Password
        </Typography>
        <TextField
          fullWidth
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Enter your Adhaar id!"
          value={securityAnswer}
          onChange={(e) => setSecurityAnswer(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleCreate}
          sx={{ backgroundColor: '#0054a8' }}
        >
          Save Password
        </Button>
      </Paper>

      <Snackbar
        open={snack}
        autoHideDuration={3000}
        onClose={() => setSnack(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackSeverity} sx={{ width: '100%' }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreatePassword;
