const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskBoard' },
});

module.exports = mongoose.model('Task', taskSchema);
