import BookList from './Books/BookList';
import MemberList from './Members/MemberList';
import './Home.css';
import Footer from "./Footer"
function Home() {
  return (
    <div className="home-container">
      <h1>Library Home</h1>
      <div className="home-content">
        <div className="home-section">
          <h2>Books</h2>
          <BookList />
        </div>
        <div className="home-section">
          <h2>Members</h2>
          <MemberList />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
