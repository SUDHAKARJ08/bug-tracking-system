const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')

dotenv.config()

const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => res.send('pavakie API'))

// routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/bugs', require('./routes/bugs'))
app.use('/api/comments', require('./routes/comments'))
app.use('/api/analytics', require('./routes/analytics'))

async function start() {
  try {
    const mongo = process.env.MONGO_URI || 'mongodb://localhost:27017/bugtrackerpro'
    await mongoose.connect(mongo)
    console.log('Connected to MongoDB')
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
  } catch (err) {
    console.error('Failed to start server', err)
    process.exit(1)
  }
}

start()