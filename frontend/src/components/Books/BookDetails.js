import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


function BookDetails() {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null); // Store book details
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track any errors

  useEffect(() => {
    // Fetch book details from the API
    fetch(`http://127.0.0.1:5555/books/${id}`) // Use backticks for template literals
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }
        return response.json();
      })
      .then((data) => {
        setBook(data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false); // Stop loading on error
      });
  }, [id]);

  // Display loading state
  if (loading) return <div>Loading...</div>;

  // Display error if there's a problem fetching the book
  if (error) return <div>Error: {error}</div>;

  // Display book details
  return (
    <div className="book-details">
      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>Genre: {book.genre}</p> {/* Assuming 'genre' is a field in your book data */}
      <p>Description: {book.description}</p> {/* Assuming 'description' is also available */}
      {/* You can add more fields as needed */}
    </div>
  );
}

export default BookDetails;