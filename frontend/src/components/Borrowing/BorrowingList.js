import { useEffect, useState } from 'react';

function BorrowingList() {
  const [borrowRecords, setBorrowRecords] = useState([]); // State for storing borrow records
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(''); // State for error messages
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filter, setFilter] = useState('all'); // State for filter
  const [filteredRecords, setFilteredRecords] = useState([]); // State for filtered records

  // Check user session for authentication
  useEffect(() => {
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

  // Fetch borrow records if authenticated
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
  }, [isAuthenticated]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter selection (filter by return status)
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Filter and search borrow records based on search query and filter
  useEffect(() => {
    let filtered = borrowRecords;

    // Search by book ID or member ID
    if (searchQuery) {
      filtered = filtered.filter((record) =>
        record.book_id.toString().includes(searchQuery) ||
        record.member_id.toString().includes(searchQuery)
      );
    }

    // Filter by return status
    if (filter === 'returned') {
      filtered = filtered.filter((record) => record.return_date);
    } else if (filter === 'not-returned') {
      filtered = filtered.filter((record) => !record.return_date);
    }

    setFilteredRecords(filtered); // Update filteredRecords state
  }, [searchQuery, filter, borrowRecords]);

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

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Book ID or Member ID..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />

      {/* Filter Dropdown */}
      <select onChange={handleFilterChange} value={filter} className="filter-dropdown">
        <option value="all">All Records</option>
        <option value="returned">Returned</option>
        <option value="not-returned">Not Returned</option>
      </select>

      {/* Display filtered records */}
      {filteredRecords.length > 0 ? (
        <ul>
          {filteredRecords.map((record) => (
            <li key={record.id}>
              {new Date(record.borrow_date).toLocaleDateString()} -{' '}
              {record.return_date
                ? new Date(record.return_date).toLocaleDateString()
                : 'Not returned'}{' '}
              | Book ID: {record.book_id} | Member ID: {record.member_id}
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
