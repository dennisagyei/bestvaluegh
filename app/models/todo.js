var mongoose = require('mongoose');

var TodoSchema = new mongoose.Schema({
  name: { type: String },
  completed: Boolean,
  note: { type: String },
  updated_at: { type: Date, default: Date.now },
});
// create model if not exists.
module.exports = mongoose.model('Todo', TodoSchema);
