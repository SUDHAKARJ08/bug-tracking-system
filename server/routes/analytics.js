const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Bug = require('../models/Bug')

router.get('/status-counts', auth, async (req, res) => {
  try {
    const counts = await Bug.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])
    res.json(counts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/by-user', auth, async (req, res) => {
  try {
    const counts = await Bug.aggregate([
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } }
    ])
    res.json(counts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/by-project', auth, async (req, res) => {
  try {
    const counts = await Bug.aggregate([
      { $group: { _id: '$project', count: { $sum: 1 } } }
    ])
    res.json(counts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
