const anecdotesRouter = require('express').Router();
const Anecdote = require('../models/anecdote');

anecdotesRouter.get('/', async (request, response) => {
  const anecdotes = await Anecdote.find({}); // Use Anecdote.find() to fetch all anecdotes
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

module.exports = anecdotesRouter;
