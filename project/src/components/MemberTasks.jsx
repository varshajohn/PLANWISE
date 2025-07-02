import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';

// Reusable, Tailwind-styled Status Badge
const StatusBadge = ({ status }) => {
  const baseClasses = 'inline-block px-3 py-1 text-xs font-semibold rounded-full';
  let colorClasses = '';
  switch (status) {
    case 'Completed':
      colorClasses = 'bg-green-100 text-green-800';
      break;
    case 'In Progress':
      colorClasses = 'bg-amber-100 text-amber-800';
      break;
    case 'To-Do':
      colorClasses = 'bg-blue-100 text-blue-800';
      break;
    default:
      colorClasses = 'bg-gray-100 text-gray-800';
  }
  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

// Function to ensure data consistency
const normalizeStatus = (status) => {
  if (status === 'Pending') return 'To-Do';
  return status || 'To-Do';
};

// Accept the 'router' prop to handle navigation
const MemberTasks = ({ tasks, router }) => {
  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* <p className="text-sm text-slate-500">Tasks / View</p> */}
        <h2 className="text-3xl font-bold text-slate-800 mt-1 mb-6">
          Your Assigned Tasks
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            <TableContainer component={Paper} variant="outlined" className="!shadow-none !border-slate-200">
              <Table sx={{ minWidth: 650 }} aria-label="your assigned tasks table">
                <TableHead className="bg-slate-50">
                  <TableRow>
                    {['Title', 'Description', 'Due Date', 'Status'].map((head) => (
                       <TableCell key={head} className="!font-bold !text-slate-600">{head}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <TableRow
                        key={task._id}
                        // Add onClick and styling to make rows interactive
                        onClick={() => router.navigate(`/tasks/view/${task._id}`)}
                        className="hover:!bg-blue-50/70 transition-colors cursor-pointer"
                      >
                        <TableCell className="!text-slate-800 !font-medium">{task.title}</TableCell>
                        <TableCell className="!text-slate-600">{task.description}</TableCell>
                        <TableCell className="!text-slate-600">{task.dueDate}</TableCell>
                        <TableCell>
                          <StatusBadge status={normalizeStatus(task.status)} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" className="!py-10 !text-slate-500">
                        You have no tasks assigned.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MemberTasks;