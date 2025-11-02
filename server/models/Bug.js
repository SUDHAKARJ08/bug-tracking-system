const mongoose = require('mongoose')
const { Schema } = mongoose

const BugSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['Low','Medium','High'], default: 'Medium' },
  status: { type: String, enum: ['Backlog','Selected for Development','In Progress','Done'], default: 'Backlog' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Bug', BugSchema)
