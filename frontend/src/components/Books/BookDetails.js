import React from 'react';
import '../../styles/BookDetails.css';

const BookDetails = ({ book }) => {
  if (!book) {
    return <p>No book selected</p>;
  }

  return (
    <div>
      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>Published Date: {book.publishedDate}</p>
    </div>
  );
};

export default BookDetails;
