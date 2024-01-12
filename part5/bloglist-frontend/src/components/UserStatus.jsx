import React from 'react';

const UserStatus = ({ user, handleLogout }) => (
  <div>
    <h2>blogs</h2>
    <p>
      {user.name} logged in <button onClick={handleLogout}>logout</button>
    </p>
  </div>
);

export default UserStatus;