// migration/add-categories.js
const mongoose = require('mongoose');
require('dotenv').config();
const Expense = require('./models/Expense');

async function migrateCategories() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const result = await Expense.updateMany(
    { category: { $exists: false } },
    { $set: { category: 'Other' } }
  );
  
  console.log(`Updated ${result.nModified} expenses with default category`);
  process.exit(0);
}

migrateCategories().catch(console.error);
