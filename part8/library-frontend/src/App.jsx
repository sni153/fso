import { useQuery } from '@apollo/client'
import { useState } from 'react'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import { ALL_AUTHORS, ME } from './queries'
import { useApolloClient } from '@apollo/client';

const App = () => {
  const authorsResult = useQuery(ALL_AUTHORS)
  const meResult = useQuery(ME)
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  if (authorsResult.loading || meResult.loading)  {
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