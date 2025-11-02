const mongoose = require('mongoose')
const { Schema } = mongoose

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Backlog','Selected for Development','In Progress','Done'], default: 'Backlog' },
  files: [{ type: String }], // Array of file paths/URLs
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Project', ProjectSchema)
