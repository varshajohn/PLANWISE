const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: String,
  assignedTo: String,
  project: String,
  status: {
    type: String,
    default: 'To-Do'
  },
  seen: {
    type: Boolean,
    default: false
  }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
