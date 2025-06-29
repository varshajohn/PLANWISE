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

const TeamsAdmin = ({ pathname, router }) => {
  const [teamData, setTeamData] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const [editIndex, setEditIndex] = useState(null);

  const subpath = pathname.split('/')[2];

  useEffect(() => {
    if (subpath === 'view') {
      axios.get('http://localhost:5000/teams')
        .then(res => {
          const formatted = res.data.map(team => ({
            _id: team._id,
            name: team.name,
            email: team.email,
            role: team.role,
          }));
          setTeamData(formatted);
        })
        .catch(error => console.log(error));
    }
  }, [subpath]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = () => {
    if (editIndex !== null) {
      const teamToUpdate = teamData[editIndex];
      axios.put(`http://localhost:5000/teamupdation/${teamToUpdate._id}`, form)
        .then(() => {
          const updated = [...teamData];
          updated[editIndex] = { ...form, _id: teamToUpdate._id };
          setTeamData(updated);
          setEditIndex(null);
          setForm({ name: '', email: '', role: '' });
          router.navigate('/teams/view');
        })
        .catch(error => console.log(error));
    } else {
      axios.post('http://localhost:5000/newTeam', form)
        .then((res) => {
          setTeamData([...teamData, res.data]);
          setForm({ name: '', email: '', role: '' });
          router.navigate('/teams/view');
        })
        .catch(error => console.log(error));
    }
  };

  const handleDelete = (index) => {
    const id = teamData[index]._id;
    axios.delete(`http://localhost:5000/teamdeletion/${id}`)
      .then(() => {
        const updated = teamData.filter((_, i) => i !== index);
        setTeamData(updated);
      })
      .catch(error => console.log(error));
  };

  const handleEdit = (index) => {
    const selected = teamData[index];
    setForm(selected);
    setEditIndex(index);
    router.navigate('/teams/add');
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
              {editIndex !== null ? 'Edit Team Member' : 'Add Team Member'}
            </Typography>
            <Stack spacing={3}>
              <TextField
                id="name"
                label="Name"
                value={form.name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                id="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                id="role"
                label="Role"
                value={form.role}
                onChange={handleChange}
                fullWidth
              />
              <StyledButton
                variant="contained"
                onClick={handleSubmit}
                size="large"
                fullWidth
              >
                {editIndex !== null ? 'Update Member' : 'Add Member'}
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
              Team Members
            </Typography>
          </motion.div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamData.map((team, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{team.name}</TableCell>
                    <TableCell>{team.email}</TableCell>
                    <TableCell>{team.role}</TableCell>
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
          Select a team action
        </Typography>
      );
  }
};

export default TeamsAdmin;