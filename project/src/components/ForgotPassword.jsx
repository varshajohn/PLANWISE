import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('verify'); // 'verify' or 'reset'
  const [snack, setSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('info');

  const memberName = localStorage.getItem('forgotMember');

  useEffect(() => {
    if (!memberName) {
      setSnackMessage('No user selected for password reset.');
      setSnackSeverity('error');
      setSnack(true);
      setTimeout(() => navigate('/'), 2000);
    }
  }, [memberName, navigate]);

  const handleVerifyAnswer = () => {
    axios.post('http://localhost:5000/teammembers/verify-security', {
      name: memberName,
      answer: securityAnswer
    })
      .then(res => {
        if (res.data.success) {
          setStep('reset');
        } else {
          setSnackMessage('Incorrect answer. Please try again.');
          setSnackSeverity('error');
          setSnack(true);
        }
      })
      .catch(() => {
        setSnackMessage('Error verifying answer');
        setSnackSeverity('error');
        setSnack(true);
      });
  };

  const handleResetPassword = () => {
  axios.put(`http://localhost:5000/teammembers/reset-password/${memberName}`, {
    newPassword: newPassword
  })
    .then(() => {
      setSnackMessage('Password reset successful');
      setSnackSeverity('success');
      setSnack(true);
      setTimeout(() => {
        localStorage.removeItem('forgotMember');
        navigate('/');
      }, 1500);
    })
    .catch(() => {
      setSnackMessage('Error resetting password');
      setSnackSeverity('error');
      setSnack(true);
    });
};


  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
        <Typography variant="h6" gutterBottom>
          Forgot Password
        </Typography>

        {step === 'verify' ? (
          <>
            <Typography variant="body2" gutterBottom>
              Security Question: Enter your Adhaar id!
            </Typography>
            <TextField
              fullWidth
              label="Your Answer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" fullWidth onClick={handleVerifyAnswer}>
              Verify Answer
            </Button>
          </>
        ) : (
          <>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              fullWidth
              disabled={!newPassword}
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </>
        )}
      </Paper>

      <Snackbar
        open={snack}
        autoHideDuration={2000}
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

export default ForgotPassword;
