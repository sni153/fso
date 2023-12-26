import { createSlice } from '@reduxjs/toolkit';

// const anecdotesAtStart = []

const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote: (state, action) => {
      let targetAnecdoteId = action.payload;
      let anecdoteToVote = state.find(anecdote => anecdote.id === targetAnecdoteId)
      if (anecdoteToVote) {
        const updatedAnecdote = {
          ...anecdoteToVote,
          votes: anecdoteToVote.votes + 1
        };
    
        return state
          .map(anecdote => (anecdote.id !== targetAnecdoteId ? anecdote : updatedAnecdote))
          .sort((a, b) => b.votes - a.votes); // Sort by votes in descending order
      }
    },
    createAnecdote: (state, action) => {
      state.push(action.payload)
    },
    appendAnecdote: (state, action) => {
      state.push(action.payload)
    },
    setAnecdotes: (state, action) => {
      return action.payload
    } 
  },
});

export const { voteAnecdote, createAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;