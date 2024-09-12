import { useEffect, useState } from 'react';

function MemberList() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/members')
      .then(res => res.json())
      .then(data => {setMembers(Array.isArray(data)? data:[]);})
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Members</h1>
      <ul>
        {members.map(member => (
          <li key={member.id}>{member.first_name} {member.last_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default MemberList;
