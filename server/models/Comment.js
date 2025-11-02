const mongoose = require('mongoose')
const { Schema } = mongoose

const CommentSchema = new Schema({
  bug: { type: Schema.Types.ObjectId, ref: 'Bug', required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Comment' },
  commentText: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Comment', CommentSchema)
