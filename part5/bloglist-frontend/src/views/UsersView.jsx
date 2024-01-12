// Import React and necessary hooks
import React from 'react';

// Import react-query for data fetching
import { useQuery } from '@tanstack/react-query';

// Import the service to fetch user data
import userService from "../services/users";

// Import Link from react-router-dom for routing
import { Link } from 'react-router-dom';

// Import UserStatus component
import UserStatus from '../components/UserStatus';

const UsersView = ({ handleLogout, user }) => {
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    retry: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <UserStatus user={user} handleLogout={handleLogout} />
      <table>
        <thead>
          <tr>
            <th>Users</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>{user.blogs ? user.blogs.length : 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersView;