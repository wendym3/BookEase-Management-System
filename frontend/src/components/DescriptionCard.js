// src/components/DescriptionCard.js
import React from 'react';
import './DescriptionCard.css'; 
import Footer from './Footer'; // Import the CSS file for styling

function DescriptionCard() {
  return (
    <div className="description-card">
      <h2>Welcome to the Library System</h2>
      <p>
        The Library System is designed to manage and streamline book borrowing and administration. 
        As an admin, you can manage books, members, and track borrowing records. 
        As a user, you can view books, borrow them, and manage your account.
      </p>
      <Footer />
    </div>
  );
}

export default DescriptionCard;