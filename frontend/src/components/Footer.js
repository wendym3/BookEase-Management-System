import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Library System. All rights reserved.</p>
        <div className="social-media">
          <a href="http://facebook.com" className="social-icon">Facebook</a>
          <a href="http://twitter.com" className="social-icon">Twitter</a>
          <a href="http://instagram.com" className="social-icon">Instagram</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;