const mongoose = require('mongoose');
const databaseInit = require('./databaseDataInit');

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

db.on('error', error => {
  console.error.bind(console, `connection error: ${error}`);
});
db.once('open', () => {
  console.log('Connected to mongodb server');
  databaseInit();
});
