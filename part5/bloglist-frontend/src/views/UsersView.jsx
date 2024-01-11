import React from 'react';
import { useQuery } from '@tanstack/react-query';
import userService from "../services/users";
import { Link } from 'react-router-dom';

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
      <h2>Users</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
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