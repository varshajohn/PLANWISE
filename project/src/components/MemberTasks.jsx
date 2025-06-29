import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled
} from '@mui/material';
import { motion } from 'framer-motion';

const StyledPaper = styled(Paper)(({theme}) => ({
  borderRadius: 12,
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(0, 84, 168, 0.2)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  color: '#0054a8',
  borderBottom: '1px solid rgba(0, 84, 168, 0.1)'
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(0, 84, 168, 0.05)'
  }
}));

const MemberTasks = ({ tasks }) => {
  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{
            color: '#0054a8',
            fontWeight: 600,
            mb: 3
          }}
        >
          Your Assigned Tasks
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <StyledPaper>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Title</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>Due Date</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{task.title}</StyledTableCell>
                    <StyledTableCell>{task.description}</StyledTableCell>
                    <StyledTableCell>{task.dueDate}</StyledTableCell>
                    <StyledTableCell>{task.status || "Not Updated"}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>
      </motion.div>
    </Box>
  );
};

export default MemberTasks;