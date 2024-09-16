// UserSignUp.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Auth.css';
import Footer from '../Footer';

function UserSignUp({ onSignup }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = (event) => {
    event.preventDefault();
    
    setError('');

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    fetch('http://127.0.0.1:5555/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
    })
      .then(res => {
        if (res.ok) {
          // Clear form fields
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
          
          // Call onSignup to update authentication state
          onSignup();
          
          // Redirect to user-home
          navigate('/user-home');
        } else {
          return res.json().then(data => setError(data.message || 'Sign-up failed. Please try again.'));
        }
      })
      .catch(err => {
        console.error('Sign up error:', err);
        setError('Something went wrong. Please try again.');
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="description-card">
          <h2>Sign Up for Library System</h2>
          <p>
            Create an account to access library books and be able to borrow some of the books. If you already have an account, please log in.
          </p>
        </div>
        <div className="form-container">
          <h1>Create Account</h1>
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
            <button type="submit" className="signup-button">Sign Up</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserSignUp;
