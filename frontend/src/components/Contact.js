import Footer from '../components/Footer';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>
        We would love to hear from you! If you have any questions or feedback, please feel free to reach out to us.
      </p>
      <p>
        <strong>Email:</strong> support@librarysystem.com
      </p>
      <p>
        <strong>Phone:</strong> (123) 456-7890
      </p>
      <Footer />
    </div>
  );
}

export default Contact;
