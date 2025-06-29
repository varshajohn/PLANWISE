const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  startDate: String, // can also be Date type
  endDate: String
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
