const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log(' MongoDB connected'))
  .catch((err) => console.error(' MongoDB connection error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  passkey: String,
});

const User = mongoose.model('User', UserSchema);

// Register Route
app.post('/api/register', async (req, res) => {
  const { name, password, passkey } = req.body;

  const userExists = await User.findOne({ name });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const newUser = new User({ name, password, passkey });
  await newUser.save();

  res.status(201).json({ message: 'User registered' });
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { name, password, passkey } = req.body;

  const user = await User.findOne({ name });

  if (!user || user.password !== password || user.passkey !== passkey) {
    return res.status(401).json({ message: 'Invalid name, password, or passkey' });
  }

  res.json({ message: 'Login successful' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
