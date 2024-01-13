import React from 'react';

const UserStatus = ({ user, handleLogout }) => (
  <div>
    <p>
      {user.name} logged in <button onClick={handleLogout}>logout</button>
    </p>
  </div>
);

export default UserStatus;