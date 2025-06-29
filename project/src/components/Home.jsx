import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box, Button, MenuItem, FormControl, InputLabel, Autocomplete,
  Typography, Snackbar, Alert, Paper, IconButton, TextField, Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Ball Background Component
const BallBackground = () => {
  return (
    <div className="background">
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`ball ball-${i + 1}`} />
      ))}
    </div>
  );
};

// CSS styles for the ball background
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

// ScrollReveal Component
const ScrollRevealText = ({ children, component = 'div', sx = {} }) => {
  const containerRef = useRef(null);
  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word inline-block" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.word');
    
    gsap.fromTo(words, 
      { 
        opacity: 0,
        y: 20,
        filter: 'blur(4px)'
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.05,
        ease: 'power2.out'
      }
    );

    return () => {
      gsap.killTweensOf(words);
    };
  }, []);

  return (
    <Typography 
      ref={containerRef} 
      component={component}
      sx={{
        ...sx,
        '& .word': {
          display: 'inline-block'
        }
      }}
    >
      {splitText}
    </Typography>
  );
};

// Home Component
const Home = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [nameOptions, setNameOptions] = useState([]);
  const [snack, setSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('success');
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAutocompleteOpen, setAutocompleteOpen] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [memberPassword, setMemberPassword] = useState('');

  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#4361ee',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", sans-serif',
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.5px'
      },
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

  useEffect(() => {
    if (role === 'Team Member') {
      axios.get('http://localhost:5000/teammembers')
        .then(res => setNameOptions(res.data.map(member => member.name)))
        .catch(err => console.log("Error fetching team members:", err));
    } else {
      setNameOptions([]);
    }
    setName('');
    setAdminEmail('');
    setAdminPassword('');
    setShowPasswordField(false);
    setMemberPassword('');
  }, [role]);

  const handleLogin = () => {
    if (role === 'Admin') {
      axios.post('http://localhost:5000/login', { email: adminEmail, password: adminPassword })
        .then(() => {
          localStorage.setItem('adminEmail', adminEmail);
          setSnackMessage('Admin login successful');
          setSnackSeverity('success');
          setSnack(true);
          setTimeout(() => navigate('/admin'), 1500);
        })
        .catch(() => {
          setSnackMessage('Invalid admin credentials');
          setSnackSeverity('error');
          setSnack(true);
        });
    } else if (role === 'Team Member' && name && !showPasswordField) {
      // Check if password is already created
      axios.get(`http://localhost:5000/teammembers/has-password/${name}`)
        .then(res => {
          if (res.data.hasPassword) {
            setShowPasswordField(true);
          } else {
            localStorage.setItem('loggedInMember', name);
            navigate('/create-password');
          }
        })
        .catch(() => {
          setSnackMessage('Error checking password');
          setSnackSeverity('error');
          setSnack(true);
        });
    } else if (role === 'Team Member' && name && showPasswordField) {
      // Try to login
      axios.post('http://localhost:5000/teammembers/login', {
        name,
        password: memberPassword
      })
        .then(() => {
          localStorage.setItem('loggedInMember', name.trim());
          setSnackMessage(`Login successful`);
          setSnackSeverity('success');
          setSnack(true);
          setTimeout(() => navigate('/teammember'), 1500);
        })
        .catch(() => {
          setSnackMessage('Invalid credentials');
          setSnackSeverity('error');
          setSnack(true);
        });
    }
  };

  const resetForm = () => {
    setRole('');
    setName('');
    setAdminEmail('');
    setAdminPassword('');
    setShowPasswordField(false);
    setMemberPassword('');
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

        {/* Welcome Section */}
        {!isLoginVisible && (
          <Box sx={{ textAlign: 'center', zIndex: 1 }}>
            <ScrollRevealText 
              component="h2"
              sx={{ 
                color: '#0054a8',
                fontWeight: 'bold',
                textShadow: '0 2px 8px rgba(0,0,0,0.1)',
                mb: 1,
                fontSize: 'clamp(2rem, 8vw, 4rem)'
              }}
            >
              Welcome to PlanWise
            </ScrollRevealText>
              
            <ScrollRevealText
              component="p"
              sx={{ 
                color: '#0054a8', 
                textShadow: '0 1px 4px rgba(0,0,0,0.1)',
                mb: 4,
                fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                maxWidth: '800px',
                mx: 'auto',
                px: 2
              }}
            >
              Your company-friendly software for managing tasks efficiently.
            </ScrollRevealText>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <IconButton
                sx={{ 
                  color: '#0054a8',
                  '&:hover': { 
                    color: '#0582ff',
                    transform: 'translateY(4px)'
                  },
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {
                  setIsLoginVisible(true);
                  resetForm();
                }}
              >
                <ChevronDownIcon style={{ width: 40, height: 40 }} />
              </IconButton>
            </motion.div>
          </Box>
        )}

        {/* Login Form */}
        {isLoginVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ zIndex: 1 }}
          >
            <Paper elevation={0} sx={{ 
              p: 4,
              width: 380,
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
                  Welcome
                </Typography>
                <IconButton 
                  onClick={() => {
                    setIsLoginVisible(false);
                    resetForm();
                  }}
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

              <TextField
                select
                fullWidth
                label="Select role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: '#0054a8',
                    '& fieldset': {
                      borderColor: 'rgba(0, 84, 168, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 84, 168, 0.4)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0, 84, 168, 0.7)',
                    '&.Mui-focused': {
                      color: 'rgba(0, 84, 168, 0.9)'
                    }
                  }
                }}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Team Member">Team Member</MenuItem>
              </TextField>

              {role === 'Admin' && (
                <Stack spacing={2.5}>
                  <TextField
                    label="Email"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    InputLabelProps={{
                      sx: { color: 'rgba(0, 84, 168, 0.7)' }
                    }}
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
                    label="Password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    InputLabelProps={{
                      sx: { color: 'rgba(0, 84, 168, 0.7)' }
                    }}
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
                    onClick={handleLogin}
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
                    Login
                  </Button>
                  <Typography variant="body2" align="center" mt={1}>
                    Don't have an account?{' '}
                    <Button
                      variant="text"
                      size="small"
                      sx={{ textTransform: 'none', padding: 0, minWidth: 'auto' }}
                      onClick={() => navigate('/signup')}
                      >
                      Sign Up
                      </Button>
                    </Typography>
                </Stack>
              )}
 {role === 'Team Member' && (
    <Stack spacing={2.5}>
      <Autocomplete
        options={nameOptions}
        inputValue={name}
        onInputChange={(e, newInputValue) => {
          setName(newInputValue);
          setAutocompleteOpen(newInputValue.length > 0);
        }}
       onChange={(e, newValue) => {
  const selectedName = newValue || '';
  setName(selectedName);
  setAutocompleteOpen(false);
  setMemberPassword('');

  if (selectedName) {
    axios.get(`http://localhost:5000/teammembers/has-password/${selectedName}`)
      .then(res => {
        if (res.data.hasPassword) {
          setShowPasswordField(true);
        } else {
          setShowPasswordField(false);
        }
      })
      .catch(err => {
        console.error("Error checking password:", err);
        setShowPasswordField(false);
      });
  }
}}

        open={isAutocompleteOpen}
        freeSolo
        filterOptions={(options, state) =>
          options.filter((opt) =>
            opt.toLowerCase().includes(state.inputValue.toLowerCase())
          )
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Enter your name"
            variant="outlined"
            onBlur={() => setAutocompleteOpen(false)}
            onFocus={() => {
              if (name.length > 0) setAutocompleteOpen(true);
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#0054a8',
                '& fieldset': { borderColor: 'rgba(0, 84, 168, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(0, 84, 168, 0.4)' },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(0, 84, 168, 0.7)',
                '&.Mui-focused': { color: 'rgba(0, 84, 168, 0.9)' },
              },
            }}
          />
        )}
        sx={{ width: '100%' }}
      />

    {showPasswordField && (
  <>
    <TextField
      label="Enter Password"
      type="password"
      value={memberPassword}
      onChange={(e) => setMemberPassword(e.target.value)}
    />
    <Typography variant="body2" align="right">
      <Button
        variant="text"
        size="small"
        sx={{ textTransform: 'none', padding: 0, minWidth: 'auto' }}
        onClick={() => {
          if (nameOptions.includes(name)) {
            localStorage.setItem('forgotMember', name);
            navigate('/forgot-password');
          } else {
            setSnackMessage('Please select a valid name first');
            setSnackSeverity('warning');
            setSnack(true);
          }
        }}
      >
        Forgot Password?
      </Button>
    </Typography>
  </>
)}


      <Button
        variant="contained"
        fullWidth
        onClick={handleLogin}
        disabled={!name || (showPasswordField && !memberPassword)}
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
          '&.Mui-disabled': {
            background: 'rgba(0, 84, 168, 0.1)',
            color: 'rgba(0, 84, 168, 0.4)'
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        Continue
      </Button>

      {!showPasswordField && (
        <Typography variant="body2" align="center">
          Don’t have a password?{' '}
          <Button
            variant="text"
            size="small"
            sx={{ textTransform: 'none', padding: 0, minWidth: 'auto' }}
            onClick={() => {
              if (nameOptions.includes(name)) {
                localStorage.setItem('loggedInMember', name);
                navigate('/create-password');
              } else {
                setSnackMessage('Please select a valid name first');
                setSnackSeverity('warning');
                setSnack(true);
              }
            }}
          >
            Create Password
          </Button>
        </Typography>
      )}

    </Stack>
  )}

            </Paper>
          </motion.div>
        )}
      </Box>

      <Snackbar
        open={snack}
        autoHideDuration={2000}
        onClose={() => setSnack(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackSeverity} sx={{ width: '100%', boxShadow: 3 }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default Home;

