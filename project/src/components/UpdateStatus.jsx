import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Alert,
} from '@mui/material'; // Keeping MUI for the form controls as they handle state well
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// --- Reusable, Tailwind-styled Status Badge (for context) ---
const StatusBadge = ({ status }) => {
  const baseClasses = 'inline-block px-3 py-1 text-xs font-semibold rounded-full';
  let colorClasses = '';
  switch (status) {
    case 'Completed': colorClasses = 'bg-green-100 text-green-800'; break;
    case 'In Progress': colorClasses = 'bg-amber-100 text-amber-800'; break;
    case 'To-Do': colorClasses = 'bg-blue-100 text-blue-800'; break;
    default: colorClasses = 'bg-gray-100 text-gray-800';
  }
  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

// --- Data consistency function ---
const normalizeStatus = (status) => {
  if (status === 'Pending') return 'To-Do';
  return status || 'To-Do';
};

const statusOptions = ['To-Do', 'In Progress', 'Completed'];

const UpdateStatus = ({ tasks, setTasks }) => {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // NEW: To hold details of the selected task

  // This effect runs when the user selects a task from the dropdown
  useEffect(() => {
    if (selectedTaskId) {
      const task = tasks.find(t => t._id === selectedTaskId);
      setSelectedTask(task);
      setNewStatus(normalizeStatus(task.status)); // Pre-fill the status dropdown
    } else {
      setSelectedTask(null);
    }
  }, [selectedTaskId, tasks]);

  const handleUpdate = () => {
    axios
      .patch(`http://localhost:5000/updatestatus/${selectedTaskId}`, { status: newStatus })
      .then(() => {
        // Refetch all tasks to ensure the UI is in sync everywhere
        axios.get("http://localhost:5000/tasks").then((response) => {
          const memberName = localStorage.getItem("loggedInMember");
          const updatedTasks = response.data.filter(task => task.assignedTo === memberName);
          setTasks(updatedTasks);
        });
        // Reset the form
        setSelectedTaskId('');
        setNewStatus('');
        setSelectedTask(null);
        setShowSnackbar(true);
      })
      .catch((err) => console.error("Error updating task status:", err));
  };

  const isButtonDisabled = !selectedTaskId || !newStatus || (selectedTask && newStatus === normalizeStatus(selectedTask.status));

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* <p className="text-sm text-slate-500">Tasks / Update Status</p> */}
        <h2 className="text-3xl font-bold text-slate-800 mt-1 mb-6">
          Update Task Status
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: The Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <FormControl fullWidth>
              <InputLabel id="task-select-label">Select a Task</InputLabel>
              <Select
                labelId="task-select-label"
                label="Select a Task"
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
              >
                {tasks.map((task) => (
                  <MenuItem key={task._id} value={task._id}>
                    {task.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!selectedTaskId}>
              <InputLabel id="status-select-label">New Status</InputLabel>
              <Select
                labelId="status-select-label"
                label="New Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <button
              onClick={handleUpdate}
              disabled={isButtonDisabled}
              className="w-full px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-300
                         bg-gradient-to-r from-blue-600 to-sky-500
                         hover:from-blue-700 hover:to-sky-600 hover:shadow-lg
                         disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
            >
              Update Status
            </button>
          </div>
        </motion.div>

        {/* Right Column: Contextual Task Details */}
        <div className="min-h-[250px]">
          <AnimatePresence>
            {selectedTask && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <div className="bg-white p-8 rounded-xl shadow-lg h-full space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 border-b pb-2 mb-2">
                    Task Details
                  </h3>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Description</p>
                    <p className="text-slate-700">{selectedTask.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Due Date</p>
                    <p className="text-slate-700">{selectedTask.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Current Status</p>
                    <StatusBadge status={normalizeStatus(selectedTask.status)} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={() => setShowSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Status updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UpdateStatus;