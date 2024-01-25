import { useQuery, useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const BirthYear = () => { 
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [authors, setAuthors] = useState([])
  const { loading, data } = useQuery(ALL_AUTHORS)

  useEffect(() => {
    if (data && data.allAuthors) {
      setAuthors(data.allAuthors)
      setName(data.allAuthors[0].name) // set name to first author's name
    }
  }, [data])

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

  if (loading) return <div>Loading...</div>

  return (
    <form onSubmit={submit}>
      <h2>Set birthyear</h2>
      <div>
        name 
        <select value={name} onChange={({ target }) => setName(target.value)}>
          {authors.map(author => 
            <option key={author.id} value={author.name}>{author.name}</option>
          )}
        </select>
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
