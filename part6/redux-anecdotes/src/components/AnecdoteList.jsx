import { voteAnecdote } from '../reducers/anecdoteReducer'; // Importing the action creator for voting on an anecdote
import { useSelector, useDispatch } from 'react-redux'; // Importing hooks for accessing Redux store state and dispatch function

const AnecdoteList = () => {
  const dispatch = useDispatch(); // Creating a dispatcher to dispatch actions
  const anecdotes = useSelector(state => state.anecdotes); // Accessing anecdotes from the Redux store state
  const filterTerm = useSelector(state => state.filter); // Accessing the filter term from the Redux store state

  // Filtering anecdotes based on the filter term
  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filterTerm.toLowerCase())
  );

  // Function to dispatch the voteAnecdote action when voting on an anecdote
  const vote = (id) => {
    dispatch(voteAnecdote(id)); // Dispatching voteAnecdote action with the anecdote ID
  };

  return (
    <div>
      {/* Displaying filtered anecdotes */}
      {filteredAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            {/* Button to vote on an anecdote */}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnecdoteList;
