import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Stack,
  Snackbar,
  Alert,
  Paper,
  styled
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 12,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(0, 84, 168, 0.2)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(to right, #0054a8, #0582ff)',
  color: 'white',
  fontWeight: 500,
  padding: theme.spacing(1.5),
  borderRadius: 8,
  '&:hover': {
    background: 'linear-gradient(to right, #0582ff, #0054a8)',
    boxShadow: '0 4px 12px rgba(0, 84, 168, 0.3)'
  },
  transition: 'all 0.3s ease'
}));

const statusOptions = ['To-Do', 'In Progress', 'Completed'];

const UpdateStatus = ({ tasks, setTasks }) => {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [status, setStatus] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleUpdate = () => {
    axios
      .patch(`http://localhost:5000/updatestatus/${selectedTaskId}`, { status })
      .then(() => {
        const memberName = localStorage.getItem("loggedInMember");
        axios.get("http://localhost:5000/tasks")
          .then((response) => {
            const updatedTasks = response.data.filter(
              task => task.assignedTo === memberName
            );
            setTasks(updatedTasks);
          });
        setSelectedTaskId('');
        setStatus('');
        setShowSnackbar(true);
      })
      .catch((err) => console.error("Error updating task status:", err));
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledPaper elevation={0}>
          <Typography 
            variant="h5" 
            mb={4}
            sx={{
              color: '#0054a8',
              fontWeight: 600
            }}
          >
            Update Task Status
          </Typography>

          <Stack spacing={3} maxWidth={400}>
            <FormControl fullWidth>
              <InputLabel 
                id="task-label"
                sx={{ color: 'rgba(0, 84, 168, 0.7)' }}
              >
                Task
              </InputLabel>
              <Select
                labelId="task-label"
                value={selectedTaskId}
                label="Task"
                onChange={(e) => setSelectedTaskId(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 84, 168, 0.2)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 84, 168, 0.4)'
                  }
                }}
              >
                {tasks.map((task) => (
                  <MenuItem key={task._id} value={task._id}>
                    {task.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!selectedTaskId}>
              <InputLabel 
                id="status-label"
                sx={{ color: 'rgba(0, 84, 168, 0.7)' }}
              >
                Status
              </InputLabel>
              <Select
                labelId="status-label"
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 84, 168, 0.2)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 84, 168, 0.4)'
                  }
                }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <StyledButton
                onClick={handleUpdate}
                disabled={!selectedTaskId || !status}
              >
                Update Status
              </StyledButton>
            </motion.div>
          </Stack>
        </StyledPaper>
      </motion.div>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={2000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          sx={{ 
            width: '100%',
            background: 'linear-gradient(to right, #0054a8, #0582ff)',
            color: 'white'
          }}
        >
          Status updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateStatus;