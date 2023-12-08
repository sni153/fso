const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Define the schema for users in the MongoDB database
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: String, // Stores the hashed password
  // Defining a reference to 'Note' documents within the user schema
  notes: [
    {
      // Specifies that each element in the 'notes' array should be an ObjectId
      type: mongoose.Schema.Types.ObjectId,
      // Establishes a reference to the 'Note' model or collection
      ref: 'Note'
    }
],
})

// Modify the JSON representation to customize the object returned
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Convert MongoDB '_id' to 'id' and remove '_id' and '__v'
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // Ensure 'passwordHash' is not included in returned JSON
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

// Create a Mongoose model 'User' based on the userSchema
const User = mongoose.model('User', userSchema)

// Export the 'User' model for use in other parts of the application
module.exports = User
