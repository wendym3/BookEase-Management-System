import { useState } from 'react';
import './Auth.css';
import Footer from '../Footer';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://127.0.0.1:5555/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) {
          window.location.href = '/home';
        } else {
          return res.json().then(data => setError(data.message));
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="description-card">
          <h2>Sign Up for Library System</h2>
          <p>
            Create an account to manage library books and records. If you already have an account, please login.
          </p>
        </div>
        <div className="form-container">
          <h1>Signup</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SignUp;