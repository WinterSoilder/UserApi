var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Register page should require First Name, Last Name, Email, Password, Confirm Password, and Company Name as mandatory, and optional address, and phone number (US Format) fields.

var userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  company: {
    type: String,
  },
  address: {
    type: String
  },
  phone: {
    type: Number
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});
var User = module.exports = mongoose.model('User', userSchema);
