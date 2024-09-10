import React, { useState } from 'react';
import AddBooks from './components/Books/AddBooks';
import BookList from './components/Books/BookList';
import EditBooks from './components/Books/EditBooks';

const App = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const addBook = (newBook) => {
    setBooks([...books, newBook]);
  };

  const updateBook = (updatedBook) => {
    setBooks(books.map((book) => (book === selectedBook ? updatedBook : book)));
    setSelectedBook(null);
  };

  return (
    <div>
      <h1>Library Management System</h1>
      <AddBooks onAddBook={addBook} />
      <BookList books={books} />
      {selectedBook && <EditBooks book={selectedBook} onUpdateBook={updateBook} />}
    </div>
  );
};

export default App;
