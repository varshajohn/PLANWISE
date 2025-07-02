const express = require('express');
const app = new express();
const cors = require('cors');
const PORT = 5000;
require('./connection');
const Project = require('./models/Projects');
const Team = require('./models/Teams');
const Task = require('./models/Task');
const Admin = require('./models/Admin');
const bcrypt = require('bcrypt');
 


app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



// server.js
app.get('/teammembers/has-password/:name', async (req, res) => {
  try {
    const member = await Team.findOne({ name: req.params.name });
    if (!member) return res.status(404).json({ message: "Not found" });
    res.json({ hasPassword: !!member.password });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
app.post('/teammembers/create-password', async (req, res) => {
  const { name, password, securityAnswer } = req.body;
  try {
    const member = await Team.findOne({ name });
    if (!member) return res.status(404).json({ message: "Team member not found" });
    if (member.password) return res.status(400).json({ message: "Password already set" });

    const saltRounds = 10;
    member.password = await bcrypt.hash(password, saltRounds);
    member.securityAnswer = await bcrypt.hash(securityAnswer, saltRounds);

    await member.save();

    res.status(200).json({ message: "Password created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
app.post('/teammembers/verify-security', async (req, res) => {
  const { name, answer } = req.body;

  try {
    const member = await Team.findOne({ name: name.trim() });
    if (!member) return res.status(404).json({ success: false, message: 'User not found' });

    if (!member.securityAnswer) {
      return res.status(400).json({ success: false, message: 'No security answer set' });
    }

    const isMatch = await bcrypt.compare(answer.trim(), member.securityAnswer);
    if (!isMatch) return res.json({ success: false });

    res.json({ success: true });
  } catch (err) {
    console.error('Error verifying answer:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.put('/teammembers/reset-password/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { newPassword } = req.body;

    if (!name || !newPassword) {
      return res.status(400).json({ success: false, message: 'Missing name or new password' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    const updated = await Team.findOneAndUpdate(
      { name },
      { password: hashed },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/teammembers/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const member = await Team.findOne({ name });
    if (!member) return res.status(404).json({ message: "Team member not found" });

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    res.status(200).json(member);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



app.get('/teammembers/:name', async (req, res) => {
  try {
    const member = await Team.findOne({ name: req.params.name });
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/admin/:email', async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.params.email });
    res.json(admin);
  } catch (err) {
    res.status(500).send("Error fetching admin details");
  }
});


app.put('/admin/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = { ...req.body };

    // Check if password is being updated and it's in plain text
    if (updateData.password && !updateData.password.startsWith('$2b$')) {
      // It's a plain password — hash it
      const hashed = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashed;
    }

    const updatedAdmin = await Admin.findOneAndUpdate(
      { email },
      updateData,
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).send("Admin not found");
    }

    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).send("Update failed");
  }
});


app.delete('/admin/:email', async (req, res) => {
  try {
    const result = await Admin.findOneAndDelete({ email: req.params.email });
    if (result) {
      res.send("Admin account deleted successfully");
    } else {
      res.status(404).send("Admin not found");
    }
  } catch (err) {
    res.status(500).send("Error deleting admin");
  }
});



app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, company, position, avatar } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      company,
      position,
      avatar
    });

    await admin.save();
    res.status(201).json({ message: "Admin signed up successfully" });
  } catch (error) {
    res.status(500).send("Signup failed: " + error.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).send("Invalid credentials");

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).send("Invalid credentials");

    res.status(200).send("Login successful");
  } catch (err) {
    res.status(500).send("Login error");
  }
});


app.get('/projects', async (req, res) => {
  try {
    const data = await Project.find();
    res.send(data);
  } catch (err) {
    console.log("Error while fetching:", err);
    res.status(500).send("Error");
  }
});

app.post('/newProject',(req,res)=>{
    try{
        var item=req.body; // Getting the new user data from the request body
        var projectdata=new Project(item); // Creating a new instance of the user model with the new user data
        const savedData= projectdata.save();
        res.send("Post Successfully");
    }
    catch(error){
        console.log("error while connecting to server");
    }
})
app.delete('/projectdeletion/:id',async(req,res)=>{
    try{
        var uid=req.params.id;
        const result=await Project.findByIdAndDelete(uid);
        res.send("Deleted Successfully");
    }
    catch(error){
        console.log("error occured while deleting");
    }
})
app.put('/projectupdation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedProject) {
      return res.status(404).send("Project not found");
    }

    res.json({
      message: "Project updated successfully",
      project: updatedProject
    });
  } catch (error) {
    console.error("Error while updating:", error);
    res.status(500).send("Error");
  }
});

app.get('/teams', async (req, res) => {
  try {
    const data = await Team.find();
    res.send(data);
  } catch (err) {
    console.log("Error while fetching:", err);
    res.status(500).send("Error");
  }
});
app.post('/newTeam', async (req, res) => {
  try {
    const item = req.body;
    const teamdata = new Team(item);
    const savedData = await teamdata.save(); // FIXED
    res.status(201).json(savedData); // send back saved object
  } catch (error) {
    console.log("Error while saving:", error);
    res.status(500).send("Error while saving team");
  }
});
app.put('/teamupdation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTeam = await Team.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTeam) {
      return res.status(404).send("Team not found");
    }

    res.json({
      message: "Team updated successfully",
      team: updatedTeam
    });
  } catch (error) {
    console.error("Error while updating:", error);
    res.status(500).send("Error");
  }
});

app.delete('/teamdeletion/:id',async(req,res)=>{
    try{
        var uid=req.params.id;
        const result=await Team.findByIdAndDelete(uid);
        res.send("Deleted Successfully");
    }
    catch(error){
        console.log("error occured while deleting");
    }
});

app.get('/tasks', async (req, res) => {
  try {
    const data = await Task.find();
    res.send(data);
  } catch (err) {
    console.log("Error while fetching:", err);
    res.status(500).send("Error");
  }
});
app.post('/newTask', async (req, res) => {
  try {
    const task = new Task({ ...req.body, seen: false }); // <--- this is the only change
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error while saving task:", error);
    res.status(500).send("Error while saving task");
  }
});

app.put('/taskupdation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTask) {
      return res.status(404).send("Task not found");
    }

    res.json({
      message: "Task updated successfully",
      task: updatedTask
    });
  } catch (error) {
    console.error("Error while updating:", error);
    res.status(500).send("Error");
  }
});

app.delete('/taskdeletion/:id',async(req,res)=>{
    try{
        var uid=req.params.id;
        const result=await Task.findByIdAndDelete(uid);
        res.send("Deleted Successfully");
    }
    catch(error){
        console.log("error occured while deleting");
    }
});
app.get('/teammembers', async (req, res) => {
  try {
    const members = await Team.find({}, 'name'); // fetch only the name field
    res.json(members);
  } catch (err) {
    res.status(500).send("Error fetching team members");
  }
});

app.patch('/updatestatus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Task.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).send("Error updating status");
  }
});
//  This route is correct
app.post('/tasks/mark-seen', async (req, res) => {
  try {
    const { ids } = req.body;
    await Task.updateMany(
      { _id: { $in: ids } },
      { $set: { seen: true } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error marking tasks as seen:", err);
    res.status(500).send("Error marking as seen");
  }
});
app.patch('/updatestatus/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).send("Error updating task");
  }
});


app.listen(PORT, () => {
    console.log(`The server is listening on port ${PORT}`);
});




// Endpoint to get consolidated details for a single task view
app.get('/task-details/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send('Task not found');
    }

    // Find the project associated with the task
    const project = await Project.findOne({ title: task.project });

    // Find all team members working on the same project
    const tasksInProject = await Task.find({ project: task.project });
    const memberNames = [...new Set(tasksInProject.map(t => t.assignedTo))];

    res.json({
      task,
      project,
      teamOnProject: memberNames,
      // In a full system, you might look up who created the task. For now, we assume an Admin.
      assignedBy: 'Admin' 
    });

  } catch (error) {
    console.error("Error fetching task details:", error);
    res.status(500).send("Server error");
  }
});

