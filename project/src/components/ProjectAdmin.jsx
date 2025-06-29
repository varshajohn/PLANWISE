import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Stack, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, IconButton
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

function ProjectAdmin({ pathname, router }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [editIndex, setEditIndex] = useState(null);

  const subpath = pathname.split('/')[2];

  useEffect(() => {
    if (subpath === 'view') {
      axios.get("http://localhost:5000/projects")
        .then(res => {
          const formatted = res.data.map(project => ({
            _id: project._id,
            title: project.title,
            description: project.description,
            startDate: project.startDate,
            endDate: project.endDate,
          }));
          setProjects(formatted);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [subpath]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = () => {
    if (editIndex !== null) {
      const projectToUpdate = projects[editIndex];
      axios.put(`http://localhost:5000/projectupdation/${projectToUpdate._id}`, form)
        .then(() => {
          const updated = [...projects];
          updated[editIndex] = { ...form, _id: projectToUpdate._id };
          setProjects(updated);
          setEditIndex(null);
          setForm({ title: '', description: '', startDate: '', endDate: '' });
          router.navigate('/project/view');
        })
        .catch(error => console.log(error));
    } else {
      axios.post('http://localhost:5000/newProject', form)
        .then((res) => {
          setProjects([...projects, res.data]);
          setForm({ title: '', description: '', startDate: '', endDate: '' });
          router.navigate('/project/view');
        })
        .catch(error => console.log(error));
    }
  };

  const handleDelete = (index) => {
    const id = projects[index]._id;
    axios.delete(`http://localhost:5000/projectdeletion/${id}`)
      .then(() => {
        const updated = projects.filter((_, i) => i !== index);
        setProjects(updated);
      })
      .catch(error => console.log(error));
  };

  const handleEdit = (index) => {
    const selected = projects[index];
    setForm(selected);
    setEditIndex(index);
    router.navigate('/project/add');
  };

  switch (subpath) {
    case 'add':
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FormContainer>
            <Typography variant="h4" align="center" gutterBottom sx={{ color: '#0054a8' }}>
              {editIndex !== null ? 'Edit Project' : 'Add New Project'}
            </Typography>
            <Stack spacing={3}>
              <TextField
                id="title"
                label="Title"
                value={form.title}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                id="description"
                label="Description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  id="startDate"
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.startDate}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  id="endDate"
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.endDate}
                  onChange={handleChange}
                  fullWidth
                />
              </Stack>
              <StyledButton
                variant="contained"
                onClick={handleSubmit}
                size="large"
                fullWidth
              >
                {editIndex !== null ? 'Update Project' : 'Add Project'}
              </StyledButton>
            </Stack>
          </FormContainer>
        </motion.div>
      );

    case 'view':
      return (
        <Box sx={{ p: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" gutterBottom sx={{ color: '#0054a8' }}>
              Project List
            </Typography>
          </motion.div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{project.title}</TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell>{project.startDate}</TableCell>
                    <TableCell>{project.endDate}</TableCell>
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

    default:
      return (
        <Typography variant="h4" align="center" sx={{ mt: 4, color: '#0054a8' }}>
          Select a project action
        </Typography>
      );
  }
}

export default ProjectAdmin;