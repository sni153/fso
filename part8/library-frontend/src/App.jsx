import { useQuery, useSubscription } from '@apollo/client'
import { useState } from 'react'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import { ALL_AUTHORS, ME, BOOK_ADDED, ALL_BOOKS } from './queries'
import { useApolloClient } from '@apollo/client';

// Function to update the Apollo Client cache.
// This function takes three arguments: the cache object, the query to update, and the new book.
export const updateCache = (cache, query, addedBook) => {
  // Helper function to ensure that the same book is not saved twice in the cache.
  // This function takes an array of books and returns a new array with duplicate books removed.
  // Duplicates are identified by their title.
  const uniqByTitle = (a) => {
    // Create a new Set to keep track of the titles of the books we've seen.
    let seen = new Set()
    // Filter the array of books, removing any books whose title we've already seen.
    return a.filter((item) => {
      let k = item.title
      // If we've seen this title before, return false to remove this book from the new array.
      // If we haven't seen this title before, add it to the Set and return true to keep this book in the new array.
      return seen.has(k) ? false : seen.add(k)
    })
  }

  // Use the updateQuery method on the cache object to update the cache for the given query.
  // The second argument to updateQuery is a function that takes the current cache data and returns the new cache data.
  cache.updateQuery(query, ({ allBooks }) => {
    // Return the new cache data.
    // The new cache data is the same as the old cache data, but with the new book added and any duplicates removed.
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const authorsResult = useQuery(ALL_AUTHORS)
  const meResult = useQuery(ME)
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  // Use Apollo's useSubscription hook to subscribe to the BOOK_ADDED subscription.
// This subscription listens for real-time updates from the server when a new book is added.
useSubscription(BOOK_ADDED, {
  // The onData function is called every time a new piece of data is sent from the server due to the subscription.
  onData: ({ data, client }) => {
    // Extract the newly added book from the data object.
    const addedBook = data.data.bookAdded;
    // Display a notification to the user indicating that a new book has been added.
    notify(`${addedBook.title} added`);
    // Call the updateCache function to update the Apollo Client cache with the new book.
    // This ensures that any components that are using the ALL_BOOKS query will re-render with the updated data.
    updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
  },
});

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={setToken} setError={notify} />
      </>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Authors show={page === 'authors'} authors={authorsResult.data.allAuthors}/>
      <Books show={page === 'books'} favoriteGenre={meResult.data.me.favoriteGenre}/>
      {token ? <NewBook show={page === 'add'} /> : <LoginForm show={page === 'login'} setToken={setToken} />}
    </div>
  )
}

export default App