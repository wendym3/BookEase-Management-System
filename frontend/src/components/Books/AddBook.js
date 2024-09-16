import { useState } from 'react';
 

function AddBook() {
  const [formData, setFormData] = useState({ title: '', author: '' });
  const [message, setMessage] = useState(''); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage('');
    setError('');
    setLoading(true); // Start loading

    fetch('http://127.0.0.1:5555/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Ensure session is handled
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          return res.json(); // Proceed if the response is successful
        } else {
          return res.json().then((data) => {
            throw new Error(data.message || 'Failed to add book');
          });
        }
      })
      .then(() => {
        setMessage('Book added successfully');
        setFormData({ title: '', author: '' }); // Clear form on success
      })
      .catch((err) => {
        console.error('Error:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </form>

      {/* Show success or error message */}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default AddBook;