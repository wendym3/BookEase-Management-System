import Footer from '../components/Footer';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <p>
        Welcome to the Library Management System. Our mission is to provide a comprehensive system for managing books and library members efficiently. 
        Our system offers features for browsing books, managing memberships, and tracking borrow records. We are committed to making library management easy and accessible for everyone.
      </p>
      <Footer />
    </div>
  );
}

export default About; // Ensure proper export