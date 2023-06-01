const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  facebookId: {
    type: String,
  },
  name: {
    type: String,
  },
});

module.exports = mongoose.model('User', userSchema);