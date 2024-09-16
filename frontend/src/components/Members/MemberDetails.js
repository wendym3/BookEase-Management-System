import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MemberDetails() {
  const [member, setMember] = useState(null);
  const [error, setError] = useState(''); // For error handling
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://127.0.0.1:5555/members`, { // Wrapped URL in backticks for template literals
      method: 'GET',
      credentials: 'include', // Ensure session cookies are included
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Error fetching member details');
        }
        return res.json();
      })
      .then(data => setMember(data))
      .catch(err => setError(err.message)); // Update error state
  }, [id]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>; // Display error message if any
  }

  if (!member) {
    return <p>Loading member details...</p>; // Show loading text while fetching data
  }

  return (
    <div>
      <h1>{member.first_name} {member.last_name}</h1>
      <p>Email: {member.email}</p>
    </div>
  );
}

export default MemberDetails; // Fixed export statement