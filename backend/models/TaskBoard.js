const mongoose = require('mongoose');

const taskBoardSchema = new mongoose.Schema({
  title: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('TaskBoard', taskBoardSchema);