import './BookCard.css';

function BookCard({ book }) {
  if (!book || !book.title || !book.author) {
    return <div className="book-card">Invalid book data</div>;
  }

  return (
    <div className="book-card">
      <div className="book-card-content">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
      </div>
    </div>
  );
}

export default BookCard;
