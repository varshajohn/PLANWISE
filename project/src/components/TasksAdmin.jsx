//TasksAdmin.jsx file have any change in this??
import React, { useEffect, useState } from 'react';
import {
  TextField, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Box, Stack,
  FormControl, InputLabel, Select, MenuItem, IconButton
} from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: 'auto',
  marginTop: theme.spacing(4),
  background: '#ffffff',
  borderRadius: theme.shape.borderRadius,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(to right, #0054a8, #0582ff)',
  color: 'white',
  fontWeight: 500,
  '&:hover': {
    background: 'linear-gradient(to right, #0582ff, #0054a8)',
  }
}));

const StatusBadge = styled(Box)(({ status }) => ({
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: 12,
  fontSize: '0.8rem',
  fontWeight: 500,
  backgroundColor:
    status === 'Completed' ? '#e8f5e9' : 
    status === 'In Progress' ? '#fff8e1' : '#ffebee',
  color:
    status === 'Completed' ? '#2e7d32' : 
    status === 'In Progress' ? '#ff8f00' : '#c62828',
}));

function TasksAdmin({ pathname, router }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: '',
    project: '',
    status: 'Pending'
  });
  const [editIndex, setEditIndex] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projectsList, setProjectsList] = useState([]);

  const subpath = pathname.split('/')[2];

  useEffect(() => {
    if (subpath === 'view') {
      axios.get('http://localhost:5000/tasks')
        .then(res => {
          const formatted = res.data.map(task => ({
            _id: task._id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate || '2025-06-30',
            assignedTo: task.assignedTo,
            project: task.project,
            status: task.status || 'Pending'
          }));
          setTasks(formatted);
        });
    }

    axios.get('http://localhost:5000/teams')
      .then(res => setTeams(res.data));

    axios.get('http://localhost:5000/projects')
      .then(res => setProjectsList(res.data));
  }, [subpath]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editIndex !== null) {
      axios.put(`http://localhost:5000/taskupdation/${tasks[editIndex]._id}`, form)
        .then(() => {
          const updated = [...tasks];
          updated[editIndex] = { ...updated[editIndex], ...form };
          setTasks(updated);
          setEditIndex(null);
          setForm({
            title: '', description: '', dueDate: '', 
            assignedTo: '', project: '', status: 'Pending'
          });
          router.navigate('/tasks/view');
        });
    } else {
      axios.post('http://localhost:5000/newTask', form)
        .then((res) => {
          setTasks([...tasks, res.data]);
          setForm({
            title: '', description: '', dueDate: '', 
            assignedTo: '', project: '', status: 'Pending'
          });
          router.navigate('/tasks/view');
        });
    }
  };

  const handleEdit = (index) => {
    const selected = tasks[index];
    setForm(selected);
    setEditIndex(index);
    router.navigate('/tasks/create');
  };

  const handleDelete = (index) => {
    const id = tasks[index]._id;
    axios.delete(`http://localhost:5000/taskdeletion/${id}`)
      .then(() => {
        const updated = tasks.filter((_, i) => i !== index);
        setTasks(updated);
      });
  };

  if (subpath === 'create') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FormContainer>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: '#0054a8' }}>
            {editIndex !== null ? 'Edit Task' : 'Create New Task'}
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Assigned To</InputLabel>
              <Select
                label="Assigned To"
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
              >
                {teams.map((member) => (
                  <MenuItem key={member._id} value={member.name}>
                    {member.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                label="Project"
                name="project"
                value={form.project}
                onChange={handleChange}
              >
                {projectsList.map((proj) => (
                  <MenuItem key={proj._id} value={proj.title}>
                    {proj.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Due Date"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <StyledButton
              variant="contained"
              onClick={handleSubmit}
              size="large"
              fullWidth
            >
              {editIndex !== null ? 'Update Task' : 'Create Task'}
            </StyledButton>
          </Stack>
        </FormContainer>
      </motion.div>
    );
  } else if (subpath === 'view') {
    return (
      <Box sx={{ p: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: '#0054a8' }}>
            Task List
          </Typography>
        </motion.div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Assigned To</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task, index) => (
                <TableRow key={task._id} hover>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>{task.assignedTo}</TableCell>
                  <TableCell>{task.project}</TableCell>
                  <TableCell>
                    <StatusBadge status={task.status}>
                      {task.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEdit(index)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  return (
    <Typography variant="h4" align="center" sx={{ mt: 4, color: '#0054a8' }}>
      Select a task action
    </Typography>
  );
}

export default TasksAdmin;