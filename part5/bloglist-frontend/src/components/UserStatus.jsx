import React from 'react';
import Button from '@mui/material/Button';

const UserStatus = ({ user, handleLogout }) => (
  <div>
    <p>
      {user.name} logged in <Button variant="contained" color="secondary" onClick={handleLogout}>logout</Button>
    </p>
  </div>
);

export default UserStatus;