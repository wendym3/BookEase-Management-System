import React, { useState } from 'react';
import '../../styles/EditBooks.css';

const EditBooks = ({ book, onUpdateBook }) => {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [publishedDate, setPublishedDate] = useState(book.publishedDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedBook = { ...book, title, author, publishedDate };
    onUpdateBook(updatedBook);
  };

  return (
    <div>
      <h2>Edit Book</h2>
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
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditBooks;
