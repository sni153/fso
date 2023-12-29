// External libraries
import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// Internal modules
import { createAnecdote } from '../requests'
import { NotificationContext } from '../contexts/NotificationContext'

const AnecdoteForm = () => {
  // Using useContext to access the dispatch function from the NotificationContext
  const { dispatch } = useContext(NotificationContext)

  // Initializing queryClient for react-query
  const queryClient = useQueryClient()

  // Mutation for creating a new anecdote
  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      // Dispatching notification when a new anecdote is created
      dispatch({ type: 'SET_NOTIFICATION', payload: `New anecdote '${newAnecdote.content}' created!` })

      // Clearing the notification after 5 seconds
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)

      // Updating the cached data in react-query
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    }
  })

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    if (content.length >= 5) {
      newAnecdoteMutation.mutate({ content, votes: 0 })
    }
  }

  // Rendering the form
  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleSubmit}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm