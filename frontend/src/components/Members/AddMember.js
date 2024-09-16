import { useEffect, useState } from 'react';

function BorrowingList() {
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(''); // State for error messages
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication

  useEffect(() => {
    // Check if the user is authenticated
    const checkSession = async () => {
      const response = await fetch('http://127.0.0.1:5555/check_session', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(true); // User is authenticated
      } else {
        setIsAuthenticated(false); // User is not authenticated
      }
    };

    checkSession(); // Check session on component mount
  }, []);

  useEffect(() => {
    const fetchBorrowRecords = async () => {
      if (!isAuthenticated) {
        setError('You need to log in to view borrow records.');
        setLoading(false);
        return; // Early return if not authenticated
      }

      try {
        const response = await fetch('http://127.0.0.1:5555/borrow_records', {
          method: 'GET',
          credentials: 'include', // Include credentials for session
        });

        if (!response.ok) {
          throw new Error('Failed to fetch borrow records');
        }

        const data = await response.json();
        setBorrowRecords(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBorrowRecords();
  }, [isAuthenticated]); // Fetch records only when authentication state changes

  // Loading state
  if (loading) {
    return <div>Loading borrow records...</div>;
  }

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Borrow Records</h1>
      {borrowRecords.length > 0 ? (
        <ul>
          {borrowRecords.map(record => (
            <li key={record.id}>
              {new Date(record.borrow_date).toLocaleDateString()} - {record.return_date ? new Date(record.return_date).toLocaleDateString() : 'Not returned'} | Book ID: {record.book_id} | Member ID: {record.member_id}
            </li>
          ))}
        </ul>
      ) : (
        <p>No borrow records found.</p>
      )}
    </div>
  );
}

export default BorrowingList;