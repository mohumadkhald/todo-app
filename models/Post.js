const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  "email": {
    type: String,
    required: true
  },
  // Other fields...
});

const User = mongoose.model('User', userSchema);
module.exports = User;