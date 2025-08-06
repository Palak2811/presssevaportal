const mongoose = require('mongoose');
require('dotenv').config();

const User = mongoose.model('Main', new mongoose.Schema({
  name: String,
  password: String,
  passkey: String,
  email: String,
  phoneno: Number,
  access: [String],
  approved: Boolean,
  isAdmin: { type: Boolean, default: false } // Ensures this field exists
}));

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ name: 'admin' });
  if (!exists) {
    await User.create({
      name: 'admin',
      password: 'qwertyuiop@a', // New: Set the correct password
      passkey: '12345678910',
      email: 'admin@gmail.com',
      phoneno: 1234567899,
      approved: true,
      isAdmin: true,
      access: [] // Admin doesn't need a specific 'access' array
    });
    console.log('Admin user created');
  } else {
    console.log('Admin already exists');
  }
  mongoose.disconnect();
}

seed();