// project/src/components/TaskDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Using react-router-dom hooks for simplicity, they work similarly to your demo router
import axios from 'axios';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Reusable Status Badge
const StatusBadge = ({ status, size = 'normal' }) => {
  const baseClasses = size === 'normal' 
    ? 'inline-block px-3 py-1 text-xs font-semibold rounded-full'
    : 'px-4 py-2 text-sm font-semibold rounded-lg';

  let colorClasses = '';
  switch (status) {
    case 'Completed': colorClasses = 'bg-green-100 text-green-800'; break;
    case 'In Progress': colorClasses = 'bg-amber-100 text-amber-800'; break;
    case 'To-Do': colorClasses = 'bg-blue-100 text-blue-800'; break;
    default: colorClasses = 'bg-gray-100 text-gray-800';
  }
  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

// Simple Avatar for team members
const MemberAvatar = ({ name }) => (
    <div title={name} className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border-2 border-white">
        {name.charAt(0).toUpperCase()}
    </div>
);

const normalizeStatus = (status) => {
  if (status === 'Pending') return 'To-Do';
  return status || 'To-Do';
};

const TaskDetail = ({ router }) => { // Accept the router prop
  const { taskId } = useParams(); // Using react-router's hook to get the ID from URL
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This extracts the ID from the custom router you are using
    const idFromPath = router.pathname.split('/view/')[1];
    if (idFromPath) {
      axios.get(`http://localhost:5000/task-details/${idFromPath}`)
        .then(res => {
          setDetails(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch task details:", err);
          setLoading(false);
        });
    }
  }, [router.pathname]);

  if (loading) {
    return <div className="p-6 text-center text-slate-500">Loading task details...</div>;
  }

  if (!details) {
    return <div className="p-6 text-center text-red-500">Could not load task details.</div>;
  }

  const { task, project, teamOnProject, assignedBy } = details;

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => router.navigate('/tasks/view')} // Use router prop to navigate
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-4"
        >
          <ArrowBackIcon />
          Back to Task List
        </button>
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-3xl font-bold text-slate-800">{task.title}</h2>
            <StatusBadge status={normalizeStatus(task.status)} size="large" />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <div>
                <h4 className="text-sm font-semibold text-slate-500 mb-1">Project</h4>
                <p className="text-lg font-medium text-blue-700">{task.project}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-500 mb-1">Description</h4>
                <p className="text-slate-700">{task.description}</p>
              </div>
              
            </div>

            <div className="space-y-6 bg-slate-50 p-4 rounded-lg">
              <div>
                <h4 className="text-sm font-semibold text-slate-500 mb-1">Due Date</h4>
                <p className="text-slate-700 font-medium">{task.dueDate}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-500 mb-1">Assigned By</h4>
                <p className="text-slate-700 font-medium">{assignedBy}</p>
              </div>
              {project && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 mb-1">Project Duration</h4>
                  <p className="text-slate-700 font-medium">{project.startDate} to {project.endDate}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Team Section */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-700 mb-3">Team on this Project</h3>
            <div className="flex flex-wrap gap-2">
              {teamOnProject.map(name => (
                <MemberAvatar key={name} name={name} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetail;