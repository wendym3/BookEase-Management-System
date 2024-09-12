import { useEffect, useState } from 'react';

function BorrowingList() {
  const [borrowRecords, setBorrowRecords] = useState([]);
  

  useEffect(() => {
    fetch('http://127.0.0.1:5555/borrow_records')
      .then(res => res.json())
      .then(data => setBorrowRecords(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Borrow Records</h1>
      <ul>
        {borrowRecords.map(record => (
          <li key={record.id}>
            {record.borrow_date} - {record.return_date || 'Not returned'} | Book ID: {record.book_id} | Member ID: {record.member_id}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BorrowingList;
