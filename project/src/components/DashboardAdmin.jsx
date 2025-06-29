import React, { useState, useEffect } from 'react';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Stack,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import axios from 'axios';

const DashboardContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  background: '#ffffff',
}));

const StatusBadge = styled(Box)(({ status }) => ({
  px: 1.5,
  py: 0.8,
  borderRadius: 12,
  fontSize: '0.8rem',
  fontWeight: 500,
  backgroundColor: 
    status === 'Completed' ? '#e8f5e9' : 
    status === 'In Progress' ? '#fff8e1' : '#ffebee',
  color: 
    status === 'Completed' ? '#2e7d32' : 
    status === 'In Progress' ? '#ff9800' : '#f44336'
}));

function DashboardAdmin() {
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTeamMember, setSelectedTeamMember] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, teamsRes, tasksRes] = await Promise.all([
          axios.get('http://localhost:5000/projects'),
          axios.get('http://localhost:5000/teams'),
          axios.get('http://localhost:5000/tasks')
        ]);
        setProjects(projectsRes.data);
        setTeamMembers(teamsRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const filteredTasks = tasks.filter((task) =>
    (selectedProject === '' || task.project === selectedProject) &&
    (selectedTeamMember === '' || task.assignedTo === selectedTeamMember)
  );

  return (
    <Box sx={{ padding: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#0054a8', fontWeight: 600 }}>
          Dashboard Overview
        </Typography>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Project</InputLabel>
            <Select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              label="Project"
            >
              <MenuItem value="">All Projects</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project._id} value={project.title}>
                  {project.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Team Members</InputLabel>
            <Select
              value={selectedTeamMember}
              onChange={(e) => setSelectedTeamMember(e.target.value)}
              label="Team Members"
            >
              <MenuItem value="">All Team Members</MenuItem>
              {teamMembers.map((member) => (
                <MenuItem key={member._id} value={member.name}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedProject('');
              setSelectedTeamMember('');
            }}
            sx={{
              borderColor: 'rgba(0, 84, 168, 0.2)',
              color: '#0054a8',
              '&:hover': {
                borderColor: 'rgba(0, 84, 168, 0.4)'
              }
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DashboardContainer>
          <Typography variant="h5" gutterBottom sx={{ color: '#0054a8', fontWeight: 600 }}>
            Task Summary
          </Typography>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Assigned To</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TableRow key={task._id} hover>
                      <TableCell>{task.project}</TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>
                        <StatusBadge status={task.status}>
                          {task.status}
                        </StatusBadge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No tasks found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DashboardContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="h6" color="primary">Total Projects</Typography>
            <Typography variant="h4" sx={{ color: '#0054a8' }}>{projects.length}</Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="h6" color="primary">Team Members</Typography>
            <Typography variant="h4" sx={{ color: '#0054a8' }}>{teamMembers.length}</Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="h6" color="primary">Total Tasks</Typography>
            <Typography variant="h4" sx={{ color: '#0054a8' }}>{filteredTasks.length}</Typography>
          </Paper>
        </Stack>
      </motion.div>
    </Box>
  );
}

export default DashboardAdmin;