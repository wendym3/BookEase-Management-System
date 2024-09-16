import { useState } from 'react';

function BorrowBook() {
  const [formData, setFormData] = useState({
    borrow_date: '',
    return_date: '',
    condition_on_return: '',
    member_id: '',
    book_id: ''
  });
  const [error, setError] = useState(''); // State for storing error messages
  const [success, setSuccess] = useState(''); // State for storing success messages

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    // Basic validation
    if (!formData.borrow_date || !formData.member_id || !formData.book_id) {
      setError('Borrow date, Member ID, and Book ID are required.');
      return;
    }

    fetch('http://127.0.0.1:5555/borrow_records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to borrow the book');
        }
        return res.json();
      })
      .then(data => {
        setSuccess('Book borrowed successfully!');
        console.log(data);
        // Clear form after successful submission
        setFormData({
          borrow_date: '',
          return_date: '',
          condition_on_return: '',
          member_id: '',
          book_id: ''
        });
      })
      .catch(err => setError(err.message || 'An error occurred while borrowing the book.'));
  };

  return (
    <div>
      <h1>Borrow Book</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="borrow_date"
          placeholder="Borrow Date"
          value={formData.borrow_date}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="return_date"
          placeholder="Return Date"
          value={formData.return_date}
          onChange={handleChange}
        />
        <input
          name="condition_on_return"
          placeholder="Condition on Return"
          value={formData.condition_on_return}
          onChange={handleChange}
        />
        <input
          name="member_id"
          placeholder="Member ID"
          value={formData.member_id}
          onChange={handleChange}
          required
        />
        <input
          name="book_id"
          placeholder="Book ID"
          value={formData.book_id}
          onChange={handleChange}
          required
        />
        <button type="submit">Borrow Book</button>
      </form>
    </div>
  );
}

export default BorrowBook;