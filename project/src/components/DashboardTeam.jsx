import React, { useMemo } from 'react';
import { 
  Card, CardContent, List, ListItem 
} from '@mui/material'; // Using Card and List for their structure
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// A helper function to get Tailwind classes for the progress bar color
const getProgressBarColor = (status) => {
  switch (status) {
    case 'Completed': return 'bg-green-500';
    case 'In Progress': return 'bg-amber-400';
    case 'To-Do': return 'bg-blue-500';
    default: return 'bg-gray-400';
  }
};

// --- Data processing and normalization logic (unchanged) ---
const COLORS = { 'Completed': '#2e7d32', 'In Progress': '#ff9800', 'To-Do': '#0d47a1' };
const normalizeStatus = (status) => {
  if (status === 'Done') return 'Completed';
  if (status === 'Pending') return 'To-Do';
  return status || 'To-Do';
};

const DashboardTeam = ({ tasks }) => {
  const totalTasks = tasks.length;
  const statusCounts = useMemo(() => tasks.reduce((acc, task) => {
    const status = normalizeStatus(task.status);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {}), [tasks]);
  
  const today = new Date();
  const overdueTasks = tasks.filter(task => new Date(task.dueDate) < today && normalizeStatus(task.status) !== 'Completed').length;
  const dueSoonTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const diffDays = (dueDate - today) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7 && normalizeStatus(task.status) !== 'Completed';
  }).length;

  const statusProgressValue = { 'To-Do': 0, 'In Progress': 50, 'Completed': 100 };
  const chartData = useMemo(() => Object.entries(statusCounts).map(([name, value]) => ({ name, value })), [statusCounts]);
  
  // CSS for the custom scrollbar
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #e2e8f0; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
  `;

  if (tasks.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <p className="p-6 text-slate-600 italic">No tasks have been assigned to you yet.</p>
      </motion.div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <style>{scrollbarStyles}</style>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Overview</h2>
      </motion.div>
      
      {/* Top Row of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[
          { label: 'Total Tasks', value: totalTasks },
          { label: 'To-Do', value: statusCounts['To-Do'] || 0 },
          { label: 'In Progress', value: statusCounts['In Progress'] || 0 },
          { label: 'Completed', value: statusCounts['Completed'] || 0 },
          { label: 'Overdue Tasks', value: overdueTasks },
          { label: 'Tasks Due Soon', value: dueSoonTasks }
        ].map((item, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.08 }}>
            <Card variant="outlined" className="h-full bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-sm hover:shadow-lg transition-shadow">
              <CardContent>
                <p className="text-slate-600 mb-1">{item.label}</p>
                <p className="text-4xl font-bold text-slate-800">{item.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Main Two-Column Layout for Chart and Task List */}
      {/* 'items-stretch' makes both columns the same height by default */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
        
        {/* Left Column: Pie Chart */}
        <motion.div className="lg:col-span-5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
             <Card variant="outlined" className="h-full bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-lg flex flex-col">
                <CardContent className="flex-grow flex flex-col">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Task Status</h3>
                    <div className="flex-grow min-h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} labelLine={false} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                                  {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#cccccc'} />))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                          </PieChart>
                      </ResponsiveContainer>
                    </div>
                </CardContent>
             </Card>
        </motion.div>

        {/* Right Column: Your Tasks (with internal scroll) */}
        <motion.div className="lg:col-span-7" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card variant="outlined" className="h-[500px] bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-lg flex flex-col">
              <CardContent className="flex flex-col flex-grow overflow-hidden">
                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex-shrink-0">
                  Your Tasks
                </h3>
                {/* THIS IS THE KEY: The list is now scrollable inside its container */}
                <List className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                  {tasks.map((task, index) => (
                    <motion.div key={task._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                        <ListItem className="p-0 mb-3">
                            <div className="w-full p-4 border border-slate-200 rounded-lg shadow-sm bg-white hover:border-blue-300 transition-colors">
                                <h4 className="text-lg font-semibold text-slate-700">{task.title}</h4>
                                <p className="text-sm text-slate-500 mb-2">Status: {normalizeStatus(task.status)}</p>
                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                  <div
                                    className={`h-2.5 rounded-full transition-all duration-500 ${getProgressBarColor(normalizeStatus(task.status))}`}
                                    style={{ width: `${statusProgressValue[normalizeStatus(task.status)] || 0}%` }}
                                  ></div>
                                </div>
                            </div>
                        </ListItem>
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
        </motion.div>
        
      </div>
    </div>
  );
};

export default DashboardTeam;