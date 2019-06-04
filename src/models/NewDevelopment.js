const mongoose = require('mongoose');
const newdevelopmentSchema = require('./schemas/newdevelopment');

// create the User model
const NewDevelopment = mongoose.model('NewDevelopment', newdevelopmentSchema);

module.exports = NewDevelopment;
