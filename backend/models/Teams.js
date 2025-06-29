const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  role: String,     
  password: String, 
  securityAnswer: {
  type: String,
  required: true
}

});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
