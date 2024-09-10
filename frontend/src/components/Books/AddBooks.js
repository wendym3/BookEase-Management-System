import React, { useState } from 'react';
import '../../styles/AddBooks.css';

const AddBooks = ({ onAddBook }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [genre, setGenre] = useState(''); // Fixed state declaration for genre

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBook = { title, author, publishedDate, genre };
    onAddBook(newBook);
    setTitle('');
    setAuthor('');
    setPublishedDate('');
    setGenre(''); // Clear genre after submission
  };

  return (
    <div>
      <h2>Add a Book</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          type="date"
          value={publishedDate}
          onChange={(e) => setPublishedDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre} // Fixed value for genre
          onChange={(e) => setGenre(e.target.value)} // Correctly handle genre input
          required
        />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBooks;
