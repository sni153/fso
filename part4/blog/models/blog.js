const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  url: { required: true, type: String },
  title: { required: true, type: String },
  author: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: { required: true, type: Number, default: 0 },
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
