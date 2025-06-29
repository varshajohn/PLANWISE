import React from 'react';
import { 
  Card, CardContent, Typography, Box, Grid, 
  LinearProgress, List, ListItem, styled 
} from '@mui/material';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const AnimatedCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(0, 84, 168, 0.2)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px 0 rgba(31, 38, 135, 0.15)',
    borderColor: 'rgba(0, 84, 168, 0.3)'
  }
}));

const StatusProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(0, 84, 168, 0.1)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    background: 'linear-gradient(to right, #0054a8, #0582ff)'
  }
}));

const DashboardTeam = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography sx={{ color: '#0054a8' }}>
          No tasks assigned to you.
        </Typography>
      </motion.div>
    );
  }

  const totalTasks = tasks.length;
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});
  const today = new Date();
  const overdueTasks = tasks.filter(task => new Date(task.dueDate) < today && task.status !== 'Completed').length;
  const dueSoonTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const diffDays = (dueDate - today) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7 && task.status !== 'Completed';
  }).length;

  const statusProgress = {
    'To-Do': 0,
    'In Progress': 50,
    'Completed': 100,
  };

  return (
    <Box sx={{ p: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#0054a8',
            fontWeight: 600,
            mb: 3
          }}
        >
          Overview
        </Typography>
      </motion.div>
      
      <Grid container spacing={3}>
        {[
          { label: 'Total Tasks', value: totalTasks },
          { label: 'To-Do', value: statusCounts['To-Do'] || 0 },
          { label: 'In Progress', value: statusCounts['In Progress'] || 0 },
          { label: 'Completed', value: statusCounts['Completed'] || 0 },
          { label: 'Overdue Tasks', value: overdueTasks },
          { label: 'Tasks Due Soon', value: dueSoonTasks }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AnimatedCard>
                <CardContent>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(0, 84, 168, 0.8)',
                      mb: 1
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: '#0054a8',
                      fontWeight: 600
                    }}
                  >
                    {item.value}
                  </Typography>
                </CardContent>
              </AnimatedCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#0054a8',
            fontWeight: 600,
            mt: 4,
            mb: 3
          }}
        >
          Your Tasks
        </Typography>
      </motion.div>

      <List>
        {tasks.map((task, index) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <ListItem sx={{ p: 0, mb: 2 }}>
              <AnimatedCard sx={{ width: '100%' }}>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#0054a8',
                      fontWeight: 500
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: 'rgba(0, 84, 168, 0.8)',
                      mb: 1
                    }}
                  >
                    Status: {task.status}
                  </Typography>
                  <StatusProgress
                    variant="determinate"
                    value={statusProgress[task.status] || 0}
                  />
                </CardContent>
              </AnimatedCard>
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Box>
  );
};

export default DashboardTeam;