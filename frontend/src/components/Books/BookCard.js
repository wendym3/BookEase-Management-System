function BookCard({ book, onBorrow }) {
  if (!book || !book.title || !book.author) {
    return <div className="book-card">Invalid book data</div>;
  }

  const handleBorrow = () => {
    onBorrow(book); // Call the borrow handler when clicked
  };

  return (
    <div className="book-card">
      <div className="book-card-content">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <button onClick={handleBorrow}>Borrow</button> {/* Borrow button */}
      </div>
    </div>
  );
}

export default BookCard;
