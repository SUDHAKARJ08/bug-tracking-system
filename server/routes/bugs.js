const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Bug = require('../models/Bug')

// Create bug
router.post('/', auth, async (req, res) => {
  try {
    const { project, title, description, priority, status, assignedTo } = req.body
    const bug = new Bug({ project, title, description, priority, status, assignedTo, createdBy: req.user._id })
    await bug.save()
    await bug.populate('assignedTo createdBy', 'name email')
    res.json(bug)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update bug
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = req.body
    const bug = await Bug.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('assignedTo createdBy', 'name email')
    if (!bug) return res.status(404).json({ message: 'Not found' })
    res.json(bug)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete bug
router.delete('/:id', auth, async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
    if (!bug) return res.status(404).json({ message: 'Not found' })
    if (!bug.createdBy.equals(req.user._id) && (!bug.assignedTo || !bug.assignedTo.equals(req.user._id))) return res.status(403).json({ message: 'Forbidden' })
    await bug.remove()
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get bugs with filters
router.get('/', auth, async (req, res) => {
  try {
    const { project, status, priority, assignedTo } = req.query
    const filter = {}
    if (project) filter.project = project
    if (status) filter.status = status
    if (priority) filter.priority = priority
    if (assignedTo) filter.assignedTo = assignedTo
    const bugs = await Bug.find(filter).populate('assignedTo createdBy', 'name email')
    res.json(bugs)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single bug
router.get('/:id', auth, async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id).populate('assignedTo createdBy', 'name email')
    if (!bug) return res.status(404).json({ message: 'Not found' })
    res.json(bug)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
