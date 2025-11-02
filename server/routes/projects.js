const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Project = require('../models/Project')
const Bug = require('../models/Bug')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/projects')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
})

// Optional file upload middleware - allows requests without files
const optionalUpload = (req, res, next) => {
  upload.array('files', 10)(req, res, (err) => {
    // Allow request to proceed even if no files are provided
    if (err && err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next()
    }
    if (err) {
      return next(err)
    }
    next()
  })
}

router.post('/', auth, upload.array('files', 10), async (req, res) => {
  try {
    const { name, description, status } = req.body
    const files = req.files ? req.files.map(f => `/uploads/projects/${f.filename}`) : []
    const project = new Project({ 
      name, 
      description, 
      status: status || 'Backlog',
      files,
      createdBy: req.user._id 
    })
    await project.save()
    res.json(project)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'name email')
    res.json(projects)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy', 'name email')
    if (!project) return res.status(404).json({ message: 'Not found' })
    const bugs = await Bug.find({ project: project._id }).populate('assignedTo createdBy', 'name email')
    res.json({ project, bugs })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/:id', auth, optionalUpload, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Not found' })
    
    // Convert both to strings for comparison to handle ObjectId comparison
    const projectCreatorId = project.createdBy.toString()
    const userId = req.user._id.toString()
    if (projectCreatorId !== userId) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    
    const { name, description, status } = req.body
    
    project.name = name || project.name
    project.description = description !== undefined ? description : project.description
    if (status) project.status = status
    
    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map(f => `/uploads/projects/${f.filename}`)
      project.files = [...(project.files || []), ...newFiles]
    }
    
    await project.save()
    await project.populate('createdBy', 'name email')
    res.json(project)
  } catch (err) {
    console.error('Update project error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Not found' })
    
    // Convert both to strings for comparison to handle ObjectId comparison
    const projectCreatorId = project.createdBy.toString()
    const userId = req.user._id.toString()
    if (projectCreatorId !== userId) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    
    await Bug.deleteMany({ project: project._id })
    await project.deleteOne()
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error('Delete project error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
