// Import necessary modules
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const anecdotesRouter = require('./controllers/anecdotes')
const Anecdote = require('./models/anecdote') // Assuming you have an Anecdote model
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const config = require('./utils/config')

// Enable async error handling
require('express-async-errors')

// Create an Express application
const app = express()

// Set mongoose to not enforce strict query
mongoose.set('strictQuery', false)

// Log the MongoDB connection string
logger.info('connecting to', config.MONGODB_URI)

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    // Log successful connection
    logger.info('connected to MongoDB')

    // Seed the database when the server starts
    const anecdotes = [
      {
        "content": "If it hurts, do it more often",
        "id": "47145",
        "votes": 0
      },
      {
        "content": "Adding manpower to a late software project makes it later!",
        "id": "21149",
        "votes": 0
      },
      {
        "content": "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
        "id": "69581",
        "votes": 0
      },
      {
        "content": "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        "id": "36975",
        "votes": 0
      },
      {
        "content": "Premature optimization is the root of all evil.",
        "id": "25170",
        "votes": 0
      },
      {
        "content": "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
        "id": "98312",
        "votes": 0
      },
      {
        "content": "Occaecat nemo corrup",
        "votes": 0,
        "id": "gtnBgkm"
      },
    ]
    anecdotes.forEach(anecdote => {
      const newAnecdote = new Anecdote(anecdote)
      newAnecdote.save()
    })
    console.log('anecdotesDB successfully seeded');
  })
  .catch((error) => {
    // Log error in case of failed connection
    logger.error('error connecting to MongoDB:', error.message)
  })

// Use CORS middleware to handle Cross-Origin Resource Sharing
app.use(cors())

// Serve static files from 'dist' directory
app.use(express.static('dist'))

// Use built-in middleware to parse incoming requests with JSON payloads
app.use(express.json())

// Use custom middleware for logging requests
app.use(middleware.requestLogger)

// Use anecdotesRouter for handling routes starting with '/api/anecdotes'
app.use('/api/anecdotes', anecdotesRouter)

// Use custom middleware for handling requests to unknown endpoints
app.use(middleware.unknownEndpoint)

// Use custom middleware for handling errors
app.use(middleware.errorHandler)

// Delete everything when the server stops
process.on('SIGINT', function() {
  Anecdote.deleteMany({})
    .then(() => {
      logger.info('All anecdotes deleted')
      mongoose.connection.close()
      process.exit(0)
    })
})

// Export the configured app
module.exports = app