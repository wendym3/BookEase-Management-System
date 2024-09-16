import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminLogin from './components/Auth/AdminLogin';
import UserLogin from './components/Auth/UserLogin';
import UserSignUp from './components/Auth/UserSignUp';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import BookList from './components/Books/BookList';
import AddBook from './components/Books/AddBook';
import EditBook from './components/Books/EditBook';
import BookDetails from './components/Books/BookDetails';
import MemberList from './components/Members/MemberList';
import AddMember from './components/Members/AddMember';
import BorrowBook from './components/Borrowing/BorrowBook';
import BorrowingList from './components/Borrowing/BorrowingList';
import Navbar from './components/Navbar';
import DescriptionCard from './components/DescriptionCard';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (admin) => {
    setIsAuthenticated(true);
    setIsAdmin(admin);
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    fetch('http://127.0.0.1:5555/logout', {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<DescriptionCard />} />
        <Route path="/admin-login" element={isAuthenticated ? <Navigate to="/admin-home" /> : <AdminLogin onLogin={() => handleLogin(true)} />} />
        <Route path="/user-login" element={isAuthenticated ? <Navigate to="/user-home" /> : <UserLogin onLogin={() => handleLogin(false)} />} />
        <Route path="/user-signup" element={isAuthenticated ? <Navigate to="/" /> : <UserSignUp onSignup={handleSignup} />} />
        <Route path="/user-home" element={isAuthenticated && !isAdmin ? <Home /> : <Navigate to="/" />} />
        <Route path="/admin-home" element={isAuthenticated && isAdmin ? <Home /> : <Navigate to="/" />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/books" element={isAuthenticated && isAdmin ? <BookList /> : <Navigate to="/" />} />
        <Route path="/books/add" element={isAuthenticated && isAdmin ? <AddBook /> : <Navigate to="/" />} />
        <Route path="/books/edit/:bookId" element={isAuthenticated && isAdmin ? <EditBook /> : <Navigate to="/" />} />
        <Route path="/books/:bookId" element={isAuthenticated ? <BookDetails /> : <Navigate to="/" />} />
        <Route path="/members" element={isAuthenticated && isAdmin ? <MemberList /> : <Navigate to="/" />} />
        <Route path="/members/add" element={isAuthenticated && isAdmin ? <AddMember /> : <Navigate to="/" />} />
        <Route path="/borrow" element={isAuthenticated ? <BorrowBook /> : <Navigate to="/" />} />
        <Route path="/borrowing-list" element={isAuthenticated && isAdmin ? <BorrowingList /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
