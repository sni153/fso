// External libraries
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext, useReducer } from 'react'

// Internal modules
import { getAnecdotes, updateAnecdote } from './requests'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { NotificationContext, notificationReducer } from './contexts/NotificationContext'

const App = () => {
  // Using useReducer to manage notification state
  const [notification, dispatch] = useReducer(notificationReducer, null)

  // Initializing queryClient for react-query
  const queryClient = useQueryClient()

  // Mutation for updating an anecdote
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      // Dispatching notification when an anecdote is voted on
      dispatch({ type: 'SET_NOTIFICATION', payload: `Voted on '${updatedAnecdote.content}'!` })

      // Clearing the notification after 5 seconds
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)

      // Updating the cached data in react-query
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      const updatedAnecdotes = anecdotes.map(anecdote => 
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      )
      queryClient.setQueryData(['anecdotes'], updatedAnecdotes)
    }
  })

  // Function to handle voting on an anecdote
  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1
    })
  }

  // Fetching anecdotes using react-query
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  // Handling loading state
  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  // Storing fetched anecdotes
  const anecdotes = result.data

  // Rendering the application
  return (
    <NotificationContext.Provider value={{ notification, dispatch }}>
      <div>
        <h3>Anecdote app</h3>
      
        <Notification />
        <AnecdoteForm />
      
        {anecdotes.map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        )}
      </div>
    </NotificationContext.Provider>
  )
}

export default App