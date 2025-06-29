const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: String,
  position: String,
  avatar: String,
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
