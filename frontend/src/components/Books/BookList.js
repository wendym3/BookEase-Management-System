import { useEffect, useState } from 'react';
import BookCard from './BookCard';
import './BookList.css';

function BookList() {
  const [books, setBooks] = useState([]); // State for storing book data
  const [borrowedBooks, setBorrowedBooks] = useState([]); // State for storing borrowed books
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    fetch('http://127.0.0.1:5555/books', {
      method: 'GET',
      credentials: 'include', // Ensures session cookies are included
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch books');
        }
        return res.json();
      })
      .then((data) => {
        setBooks(Array.isArray(data) ? data : []); // Handle unexpected data structure
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false); // Stop loading on error
      });
  }, []);

  const handleBorrowBook = (book) => {
    // Check if the book is already in the borrowedBooks list
    const isAlreadyBorrowed = borrowedBooks.some(borrowedBook => borrowedBook.id === book.id);
    
    if (isAlreadyBorrowed) {
      alert('You have already added this book to your borrow list.');
    } else {
      setBorrowedBooks((prevBorrowedBooks) => [...prevBorrowedBooks, book]);
    }
  };

  const handleRemoveBook = (bookId) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
  };

  const handleRemoveFromBorrowed = (bookId) => {
    setBorrowedBooks((prevBorrowedBooks) =>
      prevBorrowedBooks.filter((book) => book.id !== bookId)
    );
  };

  // Show loading state
  if (loading) return <div className="loading">Loading books...</div>;

  // Show error message
  if (error) return <div className="error-message">Error: {error}</div>;

  // Render book list if no error
  return (
    <div className="book-list-container">
      <div className="book-list">
        <h2>Available Books</h2>
        {books.length > 0 ? (
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <BookCard
                  book={book}
                  onBorrow={() => handleBorrowBook(book)}
                  onRemove={() => handleRemoveBook(book.id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>No books available.</p>
        )}
      </div>
      <div className="borrowed-books">
        <h2>Borrowed Books</h2>
        {borrowedBooks.length > 0 ? (
          <ul>
            {borrowedBooks.map((book) => (
              <li key={book.id}>
                {book.title}
                <button onClick={() => handleRemoveFromBorrowed(book.id)} className="remove-borrowed-button">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No borrowed books.</p>
        )}
      </div>
    </div>
  );
}

export default BookList;
