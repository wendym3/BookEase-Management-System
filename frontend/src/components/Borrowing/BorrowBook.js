import { useState } from 'react';

function BorrowBook() {
  const [formData, setFormData] = useState({
    borrow_date: '',
    return_date: '',
    condition_on_return: '',
    member_id: '',
    book_id: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:5555/borrow_records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="borrow_date" placeholder="Borrow Date" value={formData.borrow_date} onChange={handleChange} />
      <input name="return_date" placeholder="Return Date" value={formData.return_date} onChange={handleChange} />
      <input name="condition_on_return" placeholder="Condition on Return" value={formData.condition_on_return} onChange={handleChange} />
      <input name="member_id" placeholder="Member ID" value={formData.member_id} onChange={handleChange} />
      <input name="book_id" placeholder="Book ID" value={formData.book_id} onChange={handleChange} />
      <button type="submit">Borrow Book</button>
    </form>
  );
}

export default BorrowBook;
