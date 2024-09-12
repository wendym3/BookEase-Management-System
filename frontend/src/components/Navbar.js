import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isAuthenticated, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-title">Library System</h1>
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/home">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <button onClick={onLogout} className="logout-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/">Login</Link>
              <Link to="/signup">Signup</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
