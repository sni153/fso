/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
const Books = ({ show, books, favoriteGenre }) => {
const [selectedGenre, setSelectedGenre] = useState(null);
const [recommend, setRecommend] = useState(false);

  // Extract genres from books data
  const genres = [...new Set(books.flatMap(book => book.genres))];

  useEffect(() => {
    if (recommend) {
      setSelectedGenre(favoriteGenre);
    }
  }, [recommend, favoriteGenre]);

  if (!show) {
    return null
  }

  // Filter books based on selectedGenre
  const filteredBooks = selectedGenre ? books.filter(book => book.genres.includes(selectedGenre)) : books;
  
  // Set the title based on selectedGenre
  const title = 'books' + (selectedGenre ? ` in genre ${selectedGenre}` : '');
  const favoriteGenreTitle = recommend ? `books in your favorite genre  ${favoriteGenre}` : '';

  return (
    <div>
      <h2>{recommend ? favoriteGenreTitle : title}</h2>
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
        <button key={genre} onClick={() => {setSelectedGenre(genre); setRecommend(false);}}>
          {genre}
        </button>
      ))}
      <button onClick={() => {setSelectedGenre(null); setRecommend(false);}}>All genres</button>
      <button onClick={() => setRecommend(true)}>Recommend</button>
    </div>
  )
}

export default Books