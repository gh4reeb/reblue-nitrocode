const mongoose = require('mongoose');

const PipelineSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'running', 'failed', 'success'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pipeline', PipelineSchema);

