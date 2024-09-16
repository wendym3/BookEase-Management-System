import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isAuthenticated, isAdmin, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-title">BookEase System</h1>
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to={isAdmin ? "/admin-home" : "/user-home"} className="navbar-link">Home</Link>
              <Link to="/about" className="navbar-link">About</Link>
              <Link to="/contact" className="navbar-link">Contact</Link>
              {isAdmin && (
                <>
                  <Link to="/books" className="navbar-link">Books</Link>
                  <Link to="/members" className="navbar-link">Members</Link>
                  <Link to="/borrowing-list" className="navbar-link">Borrowing List</Link>
                </>
              )}
              <button onClick={onLogout} className="logout-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/admin-login" className="navbar-link">Admin</Link>
              <Link to="/user-login" className="navbar-link">Login</Link>
              <Link to="/user-signup" className="navbar-link">SignUp</Link> {/* Add link to signup */}
              <Link to="/about" className="navbar-link">About</Link>
              <Link to="/contact" className="navbar-link">Contact</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
