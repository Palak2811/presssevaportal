const mongoose = require('mongoose');
require('dotenv').config();

const FormerAdminSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneno: String,
  startDate: String,
  endDate: String
});
const FormerAdmin = mongoose.model('FormerAdmin', FormerAdminSchema);

async function seedFormerAdmins() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const formerAdminsData = [
    {
      name: 'Palak Mathur',
      email: 'palak.mathur@example.com',
      phoneno: '1234567890',
      startDate: '2020-01-15',
      endDate: '2021-06-30'
    },
    {
      name: 'alex russo',
      email: 'alex.russo@example.com',
      phoneno: '8765432109',
      startDate: '2018-03-01',
      endDate: '2019-12-31'
    },
    {
      name: 'indiana jones',
      email: 'indiana.jones@example.com',
      phoneno: '7654321098',
      startDate: '2021-07-01',
      endDate: '2023-01-20'
    }
  ];

  await FormerAdmin.deleteMany({}); // Clear existing data to prevent duplicates
  await FormerAdmin.insertMany(formerAdminsData);
  
  console.log('Former admins seeded successfully!');
  mongoose.disconnect();
}

seedFormerAdmins();