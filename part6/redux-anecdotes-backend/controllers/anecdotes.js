const anecdotesRouter = require('express').Router();
const Anecdote = require('../models/anecdote');

anecdotesRouter.get('/', async (request, response) => {
  const anecdotes = await Anecdote.find({}).sort({ votes: -1 }); // Sort anecdotes by votes in descending order
  response.json(anecdotes);
});

anecdotesRouter.post('/', async (request, response) => {
  const body = request.body;

  const newAnecdote = new Anecdote({
    content: body.content,
    votes: 0,
  });

  const savedAnecdote = await newAnecdote.save(); // Save the new anecdote

  response.status(201).json(savedAnecdote);
});

anecdotesRouter.put('/:id', async (request, response, next) => {
  const body = request.body;

  const anecdote = {
    content: body.content,
    votes: body.votes,
  };

  try {
    const updatedAnecdote = await Anecdote.findByIdAndUpdate(request.params.id, anecdote, { new: true });
    if (updatedAnecdote) {
      response.json(updatedAnecdote);
    } else {
      response.status(404).end(); 
    }
  } catch (error) {
    next(error);
  }
});

module.exports = anecdotesRouter;
