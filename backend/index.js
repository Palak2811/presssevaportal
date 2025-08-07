const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Schemas
const UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  passkey: String,
  email: String,
  phoneno: Number,
  access: [String],
  approved: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false }
});
const Main = mongoose.model('Main', UserSchema);

const FormerAdminSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneno: String,
  startDate: String,
  endDate: String
});
const FormerAdmin = mongoose.model('FormerAdmin', FormerAdminSchema);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Register
app.post('/api/register', async (req, res) => {
  const { name, password, passkey, email, phoneno } = req.body;
  if (await Main.findOne({ $or: [{ name }, { email }, { phoneno }] })) {
    return res.status(400).json({ message: 'User exists' });
  }
  await new Main({ name, password, passkey, email, phoneno, access: ['About'] }).save();
  res.status(201).json({ message: 'Registered' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { name, password, passkey } = req.body;
  const user = await Main.findOne({ name });
  if (!user || user.password !== password || user.passkey !== passkey) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (!user.approved) {
    return res.status(403).json({ message: 'Your account is pending approval.' });
  }
  
  if (user.isAdmin) {
      return res.json({ isAdmin: true });
  }
  
  const token = 'fake-jwt-token';
  res.json({ token, isAdmin: false, userAccess: user.access });
});

// Get pending
app.get('/api/admin/unapproved', async (req, res) => {
  res.json(await Main.find({ approved: false }));
});

// Get approved
app.get('/api/admin/approved', async (req, res) => {
  res.json(await Main.find({ approved: true, isAdmin: false }));
});

// Approve
app.post('/api/admin/approve', async (req, res) => {
  const { name, access } = req.body;
  const user = await Main.findOne({ name });
  if (!user) return res.status(404).json({ message: 'Not found' });
  user.access = [...new Set([...access, 'About'])];
  user.approved = true;
  await user.save();
  res.json({ message: 'Approved' });
});

// Update access
app.post('/api/admin/update-access', async (req, res) => {
  const { name, access } = req.body;
  const user = await Main.findOne({ name });
  if (!user) return res.status(404).json({ message: 'Not found' });
  user.access = [...new Set([...access, 'About'])];
  await user.save();
  res.json({ message: 'Updated' });
});

app.get('/api/admin/former-admins', async (req, res) => {
    try {
        const formerAdmins = await FormerAdmin.find({});
        res.json(formerAdmins);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching former admins' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));