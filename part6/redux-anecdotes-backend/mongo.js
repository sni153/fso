const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.mnjdgyu.mongodb.net/anecdotesDB?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const anecdoteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

// Modify the JSON output of the 'Anecdote' document
anecdoteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Anecdote = mongoose.model('Anecdote', anecdoteSchema);

const anecdote = new Anecdote({
  content: 'HTML is Easy',
  votes: 0,
});

anecdote.save().then(result => {
  console.log('Anecdote saved!');
  mongoose.connection.close();
});
