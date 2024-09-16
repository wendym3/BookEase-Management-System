import { useState } from 'react';
import Footer from '../Footer';
import './Auth.css'; // Make sure to import your CSS file for styling

function UserLogin({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://127.0.0.1:5555/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    })
    .then(res => {
      console.log(res); 
      if (res.ok) {
        return res.json(); // Process the successful response
      } else {
        return res.text().then(text => {
          throw new Error(text); // Log the HTML response if it's an error
        });
      }
    })
    .then(data => {
      onLogin(false); // Notify App about successful login and that user is not admin
      setFormData({ email: '', password: '' }); // Clear form on successful login
    })
    .catch(err => {
      console.error('Login error:', err);
      setError(err.message); // Set the error message
    });
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Member Login</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email" // Set input type to email for better validation
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
        <button type="submit" className="login-button">Login</button>
      </form>
      <Footer />
    </div>
  );
}

export default UserLogin;