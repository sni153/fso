import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const BirthYear = () => { 
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      console.log(error)
    }
  })

  const submit = async (event) => {
    event.preventDefault()
    await editAuthor({ variables: { name, setBornTo: parseInt(born) } })    
    setName('')
    setBorn('')
  }

  return (
    <form onSubmit={submit}>
      <h2>Set birthyear</h2>
      <div>
        name 
        <input 
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </div>
      <div>
        born 
        <input 
          value={born}
          onChange={({ target }) => setBorn(target.value)}
        />
      </div>
      <button type='submit'>update author</button>
    </form>
  )
}

export default BirthYear
