/* eslint-disable react/prop-types */
import { useState } from 'react'
const Books = ({ show, books }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  // Extract genres from books data
  const genres = [...new Set(books.flatMap(book => book.genres))];

  if (!show) {
    return null
  }

  // Filter books based on selectedGenre
  const filteredBooks = selectedGenre ? books.filter(book => book.genres.includes(selectedGenre)) : books;

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((genre) => (
        <button key={genre} onClick={() => setSelectedGenre(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setSelectedGenre(null)}>All genres</button>
    </div>
  )
}

export default Books