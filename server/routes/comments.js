const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Comment = require('../models/Comment')

router.post('/', auth, async (req, res) => {
  try {
    const { bug, parent, commentText } = req.body
    const comment = new Comment({ bug, parent, commentText, author: req.user._id })
    await comment.save()
    await comment.populate('author', 'name email')
    res.json(comment)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/bug/:bugId', auth, async (req, res) => {
  try {
    const comments = await Comment.find({ bug: req.params.bugId }).populate('author', 'name email').sort('createdAt')
    res.json(comments)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
