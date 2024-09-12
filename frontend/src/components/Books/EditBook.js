import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditBook() {
  const [formData, setFormData] = useState({ title: '', author: '' });
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:5555/books/${id}`)
      .then(res => res.json())
      .then(data => setFormData(data))
      .catch(err => setError('Error fetching book data'));
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:5555/books/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to update book');
        }
        return res.json();
      })
      .then(() => {
        navigate(`/books`);
      })
      .catch(err => setError(err.message));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Book</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
      <input name="author" placeholder="Author" value={formData.author} onChange={handleChange} required />
      <button type="submit">Update Book</button>
    </form>
  );
}

export default EditBook;
