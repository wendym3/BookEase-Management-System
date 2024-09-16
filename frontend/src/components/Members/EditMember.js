import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditMember() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:5555/members/${id}`, {
      method: 'GET',
      credentials: 'include', // Ensure session cookies are included
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Error fetching member data');
        }
        return res.json();
      })
      .then(data => setFormData(data))
      .catch(err => setError(err.message));
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:5555/members/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Ensure session cookies are included
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to update member');
        }
        return res.json();
      })
      .then(() => {
        navigate(`/members/${id}`); // Corrected navigation syntax
      })
      .catch(err => setError(err.message));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Member</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        name="first_name"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
        required
      />
      <input
        name="last_name"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Update Member</button>
    </form>
  );
}

export default EditMember;