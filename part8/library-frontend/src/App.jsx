import { useQuery } from '@apollo/client'
import { useState } from 'react'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm' // import LoginForm
import Notify from './components/Notify'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'
import { useApolloClient } from '@apollo/client';

const App = () => {
  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null) // add token state
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  if (authorsResult.loading || booksResult.loading)  {
    return <div>loading...</div>
  }

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
        {token && <button onClick={() => setPage('add')}>add book</button>} {/* show add book button only if logged in */}
        {token && <button onClick={logout}>logout</button>} {/* show logout button only if logged in */}
      </div>

      <Authors show={page === 'authors'} authors={authorsResult.data.allAuthors}/>
      <Books show={page === 'books'} books={booksResult.data ? booksResult.data.allBooks : []} />
      {token ? <NewBook show={page === 'add'} /> : <LoginForm show={page === 'login'} setToken={setToken} />} {/* show LoginForm or NewBook based on login state */}
    </div>
  )
}

export default App