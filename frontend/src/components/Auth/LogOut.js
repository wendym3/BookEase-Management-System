import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useState } from 'react';

function LogOut() {
    const navigate = useNavigate(); // Initialize useNavigate hook for redirection
    const [error, setError] = useState('');

    const handleLogout = () => {
        fetch('http://127.0.0.1:5555/logout', {
            method: 'DELETE',
            credentials: 'include', // Ensure session cookies are included
        })
        .then(res => {
            if (res.ok) {
                console.log('Logged out successfully');
                // Redirect to login page after logout
                navigate('/');
            } else {
                throw new Error('Failed to log out');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            setError('Logout failed. Please try again.');
        });
    };

    return (
        <div>
            <button onClick={handleLogout} className="logout-button">Logout</button>
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>} {/* Display error message if exists */}
        </div>
    );
}

export default LogOut;