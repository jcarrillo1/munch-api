const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userId: String,
  interests: [String],
  history: [String],
  blacklist: [String],
  friends: [String],
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);
