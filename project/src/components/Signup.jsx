import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Paper,
  Snackbar, Alert, IconButton, Stack, InputLabel, FormControl
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';

// Ball Background Component (same as Home.jsx)
const BallBackground = () => {
  return (
    <div className="background">
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`ball ball-${i + 1}`} />
      ))}
    </div>
  );
};

// CSS styles for the ball background (same as Home.jsx)
const ballStyles = `
  @keyframes move {
    100% {
      transform: translate3d(0, 0, 1px) rotate(360deg);
    }
  }

  .background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background: #ffffff;
    overflow: hidden;
    z-index: -1;
  }

  .ball {
    position: absolute;
    width: 20vmin;
    height: 20vmin;
    border-radius: 50%;
    backface-visibility: hidden;
    animation: move linear infinite;
  }

  .ball:nth-child(odd) {
      color: #0054a8;
  }

  .ball:nth-child(even) {
      color: #0582ff;
  }

  .ball:nth-child(1) {
    top: 77%;
    left: 88%;
    animation-duration: 40s;
    animation-delay: -3s;
    transform-origin: 16vw -2vh;
    box-shadow: 40vmin 0 5.703076368487546vmin currentColor;
  }
  .ball:nth-child(2) {
    top: 42%;
    left: 2%;
    animation-duration: 53s;
    animation-delay: -29s;
    transform-origin: -19vw 21vh;
    box-shadow: -40vmin 0 5.17594621519026vmin currentColor;
  }
  .ball:nth-child(3) {
    top: 28%;
    left: 18%;
    animation-duration: 49s;
    animation-delay: -8s;
    transform-origin: -22vw 3vh;
    box-shadow: 40vmin 0 5.248179047256236vmin currentColor;
  }
  .ball:nth-child(4) {
    top: 50%;
    left: 79%;
    animation-duration: 26s;
    animation-delay: -21s;
    transform-origin: -17vw -6vh;
    box-shadow: 40vmin 0 5.279749632220298vmin currentColor;
  }
  .ball:nth-child(5) {
    top: 46%;
    left: 15%;
    animation-duration: 36s;
    animation-delay: -40s;
    transform-origin: 4vw 0vh;
    box-shadow: -40vmin 0 5.964309466052033vmin currentColor;
  }
  .ball:nth-child(6) {
    top: 77%;
    left: 16%;
    animation-duration: 31s;
    animation-delay: -10s;
    transform-origin: 18vw 4vh;
    box-shadow: 40vmin 0 5.178483653434181vmin currentColor;
  }
  .ball:nth-child(7) {
    top: 22%;
    left: 17%;
    animation-duration: 55s;
    animation-delay: -6s;
    transform-origin: 1vw -23vh;
    box-shadow: -40vmin 0 5.703026794398318vmin currentColor;
  }
  .ball:nth-child(8) {
    top: 41%;
    left: 47%;
    animation-duration: 43s;
    animation-delay: -28s;
    transform-origin: 25vw -3vh;
    box-shadow: 40vmin 0 5.196265905749415vmin currentColor;
  }
`;

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    position: '',
    avatar: ''
  });

  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const isEdit = searchParams.get("edit") === "true";
  const editingEmail = searchParams.get("email");

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#4361ee',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", sans-serif',
      h5: {
        fontWeight: 600,
        letterSpacing: '0.5px'
      },
      button: {
        textTransform: 'none',
        fontWeight: 500
      }
    }
  });

  // 🔄 Load existing data in edit mode
  useEffect(() => {
    if (isEdit && editingEmail) {
      axios.get(`http://localhost:5000/admin/${editingEmail}`)
        .then(res => setForm(res.data))
        .catch(err => {
          console.error("Failed to load admin:", err);
          setSnack({ open: true, message: 'Failed to load profile', severity: 'error' });
        });
    }
  }, [isEdit, editingEmail]);

  // 🖼️ Image upload handler (base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = () => {
    if (isEdit) {
      axios.put(`http://localhost:5000/admin/${form.email}`, form)
        .then(() => {
          setSnack({ open: true, message: 'Profile updated successfully.', severity: 'success' });
          setTimeout(() => navigate('/admin'), 1500);
        })
        .catch(() => {
          setSnack({ open: true, message: 'Update failed. Try again.', severity: 'error' });
        });
    } else {
      axios.post('http://localhost:5000/signup', form)
        .then(() => {
          setSnack({ open: true, message: 'Signup successful. Please login.', severity: 'success' });
          setTimeout(() => navigate('/'), 1500);
        })
        .catch(() => {
          setSnack({ open: true, message: 'Signup failed. Try again.', severity: 'error' });
        });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Add the ball background styles */}
      <style>{ballStyles}</style>
      
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Ball Background */}
        <BallBackground />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={0} sx={{ 
            p: 4,
            width: 400,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0, 84, 168, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            '&:hover': {
              borderColor: 'rgba(0, 84, 168, 0.3)'
            }
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" sx={{ 
                color: '#0054a8',
                fontWeight: 600,
              }}>
                {isEdit ? 'Edit Profile' : 'Admin Signup'}
              </Typography>
              <IconButton 
                onClick={() => navigate('/')}
                sx={{ 
                  color: 'rgba(0, 84, 168, 0.8)',
                  '&:hover': { 
                    color: '#0054a8',
                    transform: 'rotate(90deg)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Avatar preview and upload */}
            <Box textAlign="center" mb={3}>
              <img
                src={form.avatar || "https://via.placeholder.com/100?text=Avatar"}
                alt="Avatar Preview"
                style={{
                  width: 100, 
                  height: 100, 
                  borderRadius: "50%", 
                  objectFit: "cover", 
                  marginBottom: 8,
                  border: '2px solid rgba(0, 84, 168, 0.2)'
                }}
              />
              <Button 
                component="label" 
                variant="outlined"
                sx={{
                  color: '#0054a8',
                  borderColor: 'rgba(0, 84, 168, 0.5)',
                  '&:hover': {
                    borderColor: '#0054a8'
                  }
                }}
              >
                Upload Avatar
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  hidden
                  onChange={handleImageUpload}
                />
              </Button>
            </Box>

            {/* Input fields */}
            <Stack spacing={2}>
              <TextField 
                id="name" 
                label="Name" 
                fullWidth 
                value={form.name} 
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#0054a8',
                    '& fieldset': {
                      borderColor: 'rgba(0, 84, 168, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 84, 168, 0.4)',
                    },
                  }
                }}
              />
              <TextField 
                id="email" 
                label="Email" 
                type="email" 
                fullWidth 
                value={form.email} 
                onChange={handleChange} 
                disabled={isEdit}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#0054a8',
                    '& fieldset': {
                      borderColor: 'rgba(0, 84, 168, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 84, 168, 0.4)',
                    },
                  }
                }}
              />
              <TextField 
                id="password" 
                label="Password" 
                type="password" 
                fullWidth 
                value={form.password} 
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#0054a8',
                    '& fieldset': {
                      borderColor: 'rgba(0, 84, 168, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 84, 168, 0.4)',
                    },
                  }
                }}
              />
              <TextField 
                id="company" 
                label="Company Name" 
                fullWidth 
                value={form.company} 
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#0054a8',
                    '& fieldset': {
                      borderColor: 'rgba(0, 84, 168, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 84, 168, 0.4)',
                    },
                  }
                }}
              />
              <TextField 
                id="position" 
                label="Position" 
                fullWidth 
                value={form.position} 
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#0054a8',
                    '& fieldset': {
                      borderColor: 'rgba(0, 84, 168, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 84, 168, 0.4)',
                    },
                  }
                }}
              />

              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleSubmit}
                sx={{
                  mt: 1,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 500,
                  background: 'linear-gradient(to right, #0054a8, #0582ff)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #0582ff, #0054a8)',
                    boxShadow: '0 4px 12px rgba(0, 84, 168, 0.3)'
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {isEdit ? 'Save Changes' : 'Sign Up'}
              </Button>
            </Stack>
          </Paper>
        </motion.div>

        <Snackbar
          open={snack.open}
          autoHideDuration={2000}
          onClose={() => setSnack({ ...snack, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={snack.severity} sx={{ width: '100%', boxShadow: 3 }}>
            {snack.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Signup;