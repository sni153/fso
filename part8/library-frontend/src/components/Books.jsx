/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = ({ show, favoriteGenre }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [recommend, setRecommend] = useState(false);

  const { loading: loadingAllBooks, data: allBooksData } = useQuery(ALL_BOOKS);

  // Extract genres from all books data
  const genres = allBooksData ? [...new Set(allBooksData.allBooks.flatMap(book => book.genres))] : [];

  // Fetch books based on selectedGenre
  const { loading, error, data } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre, // Skip this query if no genre is selected
  });

  useEffect(() => {
    if (recommend) {
      setSelectedGenre(favoriteGenre);
    }
  }, [recommend, favoriteGenre]);

  if (!show || loadingAllBooks) {
    return null
  }

  // Filter books based on selectedGenre
  const filteredBooks = selectedGenre && data ? data.allBooks : allBooksData.allBooks;

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