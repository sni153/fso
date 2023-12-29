// Import the useDispatch hook from react-redux. This hook will give us the dispatch function from our Redux store.
import { useDispatch } from 'react-redux'

// Import the createAnecdote action creator from our anecdoteReducer.
import { createAnecdote } from '../reducers/anecdoteReducer'

// Import the updateNotification and clearNotification action creators from our notificationReducer.
import { setNotification } from '../reducers/notificationReducer'

// Define the AnecdoteForm component.
const AnecdoteForm = () => {
  // Get the dispatch function from our Redux store using the useDispatch hook.
  const dispatch = useDispatch()

  // Define the addAnecdote function. This function will be called when the form is submitted.
  const addAnecdote = async (event) => {
    // Prevent the default form submission behavior.
    event.preventDefault()

    // Get the value of the input field.
    const content = event.target.anecdote.value

    // Clear the input field.
    event.target.anecdote.value = ''

    // Dispatch the createAnecdote action with the input value.
    dispatch(createAnecdote(content))

    // Dispatch the setNotification action with a message and duration.
    dispatch(setNotification(`new anecdote '${content}'`, 5))
  }

  // Render the form.
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote" /></div>
        <button>create</button>
      </form>
    </>
  )
}

// Export the AnecdoteForm component as the default export of this module.
export default AnecdoteForm