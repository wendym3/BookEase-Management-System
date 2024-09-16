import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditBook() {
  const [formData, setFormData] = useState({ title: '', author: '' });
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(''); // Track errors
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the existing book data to pre-fill the form
    fetch(`http://127.0.0.1:5555/books/${id}`) // Corrected: use backticks for template literals
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error fetching book data');
        }
        return res.json();
      })
      .then((data) => {
        setFormData(data);
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((err) => {
        setError(err.message || 'Error fetching book data');
        setLoading(false); // Stop loading on error
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    fetch(`http://127.0.0.1:5555/books/${id}`, { // Corrected: use backticks for template literals
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Ensure session cookies are included
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update book');
        }
        return res.json();
      })
      .then(() => {
        navigate('/books'); // Navigate back to book list on success
      })
      .catch((err) => setError(err.message || 'Failed to update book'));
  };

  // Loading state
  if (loading) return <p>Loading book data...</p>;

  return (
    <div>
      <h1>Edit Book</h1>
      {/* Display error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Book form */}
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
        <button type="submit">Update Book</button>
      </form>
    </div>
  );
}

export default EditBook;