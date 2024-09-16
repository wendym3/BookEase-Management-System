import React from 'react';
import BookList from './Books/BookList';
import './Home.css';
import Footer from './Footer';

function Home() {
  return (
    <div className="home-container">
          <div className="home-content">
        <div className="home-section">
          <BookList />
        </div>
       </div>
      <Footer />
    </div>
  );
}

export default Home;
