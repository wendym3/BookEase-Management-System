import { useEffect, useState } from 'react';
import BookCard from './BookCard';
import './BookList.css';
function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/books',)
      .then(res => res.json())
      .then(data => {setBooks(Array.isArray(data)? data:[]);})
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Books</h1>
      <ul>
        {books.map(book => (
          <BookCard key={book.id}>{book.title} by {book.author}</BookCard>
        ))}
      </ul>
    </div>
  );
}

export default BookList;
