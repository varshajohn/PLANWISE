import React, { useState, useEffect, useMemo } from 'react';
import {
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
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Reusable Status Badge Component
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

// Reusable Stat Card Component
const StatCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <h4 className="font-semibold text-slate-500">{title}</h4>
        <p className="text-5xl font-bold text-slate-800 mt-2">{value}</p>
    </div>
);

// Data processing and normalization logic
const COLORS = { 'Completed': '#2e7d32', 'In Progress': '#ff9800', 'To-Do': '#0d47a1' };
const normalizeStatus = (status) => {
  if (status === 'Done') return 'Completed';
  if (status === 'Pending') return 'To-Do';
  return status || 'To-Do';
};

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
      } catch (error) { console.error('Error fetching data:', error); }
    };
    fetchData();
  }, []);
  
  const filteredTasks = useMemo(() => tasks.filter(task =>
    (selectedProject === '' || task.project === selectedProject) &&
    (selectedTeamMember === '' || task.assignedTo === selectedTeamMember)
  ), [tasks, selectedProject, selectedTeamMember]);

  const chartData = useMemo(() => {
    if (filteredTasks.length === 0) return [];
    const statusCounts = filteredTasks.reduce((acc, task) => {
      const status = normalizeStatus(task.status);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [filteredTasks]);

  const displayedStats = useMemo(() => {
      const stats = {
          showProjects: true,
          showMembers: true,
          projectsCount: projects.length,
          membersCount: teamMembers.length,
      };

      if (selectedProject) {
          stats.showProjects = false;
          const membersInProject = new Set(filteredTasks.map(t => t.assignedTo));
          stats.membersCount = membersInProject.size;
      }

      if (selectedTeamMember) {
          stats.showMembers = false;
          if (!selectedProject) {
              const projectsForMember = new Set(filteredTasks.map(t => t.project));
              stats.projectsCount = projectsForMember.size;
          }
      }
      
      return stats;
  }, [selectedProject, selectedTeamMember, filteredTasks, projects.length, teamMembers.length]);
  
  // --- NEW: Custom scrollbar styles ---
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #e2e8f0; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
  `;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* --- NEW: Adding the style tag to the component --- */}
      <style>{scrollbarStyles}</style>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-slate-800 mb-6">
          Dashboard Overview
        </h2>
      </motion.div>
      
      {/* Filter Controls */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <FormControl sx={{ minWidth: 200, bgcolor: 'white' }}>
            <InputLabel>Project</InputLabel>
            <Select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} label="Project">
              <MenuItem value="">All Projects</MenuItem>
              {projects.map((project) => (<MenuItem key={project._id} value={project.title}>{project.title}</MenuItem>))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200, bgcolor: 'white' }}>
            <InputLabel>Team Members</InputLabel>
            <Select value={selectedTeamMember} onChange={(e) => setSelectedTeamMember(e.target.value)} label="Team Members">
              <MenuItem value="">All Team Members</MenuItem>
              {teamMembers.map((member) => (<MenuItem key={member._id} value={member.name}>{member.name}</MenuItem>))}
            </Select>
          </FormControl>
          <button
            onClick={() => { setSelectedProject(''); setSelectedTeamMember(''); }}
            className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-md hover:bg-slate-100 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </motion.div>

      {/* Top Section: Chart and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
        {/* Chart Card */}
        <motion.div className="lg:col-span-1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="bg-white p-4 rounded-xl shadow-lg h-full">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Task Status Distribution</h3>
            <div className="h-[300px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" labelLine={false}>
                      {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#cccccc'} />))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">No task data to display.</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards Container */}
        <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row gap-6">
                <AnimatePresence>
                    {displayedStats.showProjects && (
                        <motion.div className="flex-1" layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
                            <StatCard title={selectedTeamMember ? "Member's Projects" : "Total Projects"} value={displayedStats.projectsCount} />
                        </motion.div>
                    )}
                    {displayedStats.showMembers && (
                        <motion.div className="flex-1" layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
                            <StatCard title={selectedProject ? "Members in Project" : "Team Members"} value={displayedStats.membersCount} />
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div className="flex-1" layout transition={{ duration: 0.3 }}>
                    <StatCard title="Tasks (Filtered)" value={filteredTasks.length} />
                </motion.div>
            </div>
        </div>
      </div>

      {/* Bottom Section: Task Summary Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Task Summary</h3>
          {/* --- CHANGE: Added classes for max-height and scrolling --- */}
          <TableContainer component={Paper} variant="outlined" className="max-h-[60vh] overflow-y-auto custom-scrollbar !shadow-none !border-slate-200">
            <Table stickyHeader>
              <TableHead className="bg-slate-100">
                <TableRow>
                  {['Project', 'Title', 'Assigned To', 'Due Date', 'Status'].map(head => (
                    <TableCell key={head} className="!font-bold !text-slate-600">{head}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TableRow key={task._id} className="hover:bg-slate-50/50">
                      <TableCell>{task.project}</TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell><StatusBadge status={normalizeStatus(task.status)} /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={5} align="center" className="!py-10 !text-slate-500">No tasks found matching your filters.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardAdmin;