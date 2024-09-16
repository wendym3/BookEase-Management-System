import { useState } from 'react';
import Footer from '../Footer';
import './Auth.css';

function AdminLogin({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:5555/admin_login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (res.ok) {
          onLogin(true); 
        } else {
          return res.json().then(data => {
            throw new Error(data.message || 'Login failed');
          });
        }
      })
      .catch(err => setError(err.message));
  };

  return (
    <div className="auth-container">
      <div className="description-card">
        <h2>Admin Login</h2>
        <p>Welcome to the Admin Login page. Please log in to manage the library system.</p>
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Admin</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email" 
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button> {/* Add class for styling */}
      </form>
      <Footer />
    </div>
  );
}

export default AdminLogin;