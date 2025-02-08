const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  team: { type: String, required: true },
  branch: { type: String, required: true },
  appointments: { type: Number, required: true },
  presentations: { type: Number, required: true },
  closedCases: { type: Number, required: true },
  callBacks: { type: Number, required: true },
  referrals: { type: Number, required: true },
});

module.exports = mongoose.model('Report', reportSchema);
