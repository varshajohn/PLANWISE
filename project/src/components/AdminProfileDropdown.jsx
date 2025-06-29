import React, { useState, useEffect } from 'react';
import {
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Typography,
  Divider,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';

const AdminProfileDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const open = Boolean(anchorEl);
  const email = localStorage.getItem('adminEmail');

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:5000/admin/${email}`)
        .then((res) => setAdmin(res.data))
        .catch((err) => console.error('Failed to load admin:', err));
    }
  }, []);

  const handleEditProfile = () => {
    if (admin?.email) {
      window.location.href = `/signup?edit=true&email=${admin.email}`;
    }
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:5000/admin/${email}`)
      .then(() => {
        localStorage.removeItem('adminEmail');
        window.location.href = '/';
      })
      .catch(err => {
        console.error("Error deleting admin:", err);
        alert("Something went wrong while deleting.");
      });
  };

  return (
    <>
        <IconButton color="inherit" onClick={handleOpen}>
  {admin?.avatar ? (
    <Avatar src={admin.avatar} alt={admin.name} sx={{ width: 36, height: 36 }} />
  ) : (
    <AccountCircleIcon fontSize="large" />
  )}
</IconButton>


      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: 250, mt: 1 } }}
      >
        {admin && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Avatar
              src={admin.avatar}
              sx={{ width: 64, height: 64, margin: '0 auto' }}
            />
            <Typography variant="subtitle1" fontWeight="bold">{admin.name}</Typography>
            <Typography variant="body2" color="text.secondary">{admin.email}</Typography>
            <Typography variant="caption" display="block" mt={0.5}>
              {admin.position} @ {admin.company}
            </Typography>
          </Box>
        )}
        <Divider />
        <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
        <MenuItem onClick={() => setConfirmOpen(true)} sx={{ color: 'red' }}>
          Delete My Account
        </MenuItem>
      </Menu>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete your admin account? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminProfileDropdown;
