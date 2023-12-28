const mongoose = require('mongoose');

// Define the schema for the 'Anecdote' model
const anecdoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  votes: {
    type: Number,
    default: 0
  }
});

// Modify the JSON output of the 'Anecdote' document
anecdoteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Convert '_id' to 'id' and remove unwanted fields before returning as JSON
    returnedObject.id = returnedObject._id.toString(); // Convert '_id' to a string 'id'
    delete returnedObject._id; // Remove the '_id' field
    delete returnedObject.__v; // Remove the '__v' field (version key)
  }
});

// Create and export the 'Anecdote' model based on the defined schema
module.exports = mongoose.model('Anecdote', anecdoteSchema);
