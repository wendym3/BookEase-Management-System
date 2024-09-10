import React, { useState } from 'react';
import '../../styles/BookList.css';

const BookList = ({ books }) => {
  const [sortKey, setSortKey] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  const sortBooks = (books) => {
    return books.sort((a, b) => {
      let valueA = a[sortKey];
      let valueB = b[sortKey];

      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedBooks = sortBooks(books);

  return (
    <div>
      <h2>Book List</h2>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('title')}>Title</th>
            <th onClick={() => handleSort('author')}>Author</th>
            <th onClick={() => handleSort('publishedDate')}>Published Date</th>
            <th onClick={() => handleSort('genre')}>Genre</th>
          </tr>
        </thead>
        <tbody>
          {sortedBooks.map((book, index) => (
            <tr key={index}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publishedDate}</td>
              <td>{book.genre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
