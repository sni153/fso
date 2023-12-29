import { voteForAnecdote } from '../reducers/anecdoteReducer'; // Importing the action creator for voting on an anecdote
import { updateNotification, clearNotification } from '../reducers/notificationReducer'; // Import the notification actions
import { useSelector, useDispatch } from 'react-redux'; // Importing hooks for accessing Redux store state and dispatch function

const AnecdoteList = () => {
  const dispatch = useDispatch(); // Creating a dispatcher to dispatch actions
  const anecdotes = useSelector(state => state.anecdotes); // Accessing anecdotes from the Redux store state
  const filterTerm = useSelector(state => state.filter); // Accessing the filter term from the Redux store state

  // Filtering anecdotes based on the filter term
  const filteredAnecdotes = anecdotes.filter(anecdote => {
    return anecdote.content.toLowerCase().includes(filterTerm.toLowerCase())
  });

  const handleVote = (id) => {
    const votedAnecdote = anecdotes.find(anecdote => anecdote.id === id);
    dispatch(updateNotification(`you voted '${votedAnecdote.content}'`));
    dispatch(voteForAnecdote(votedAnecdote));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
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
            <button onClick={() => handleVote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnecdoteList;
