// Import React for building the component
import React from 'react';

// Import useParams from react-router-dom for accessing route parameters
import { useParams } from 'react-router-dom';

// Import useQuery from react-query for data fetching
import { useQuery } from '@tanstack/react-query';

// Import the service to fetch user data
import userService from "../services/users";

// Import User component
import User from '../components/User';

const UserView = ({ handleLogout }) => {
  const { id } = useParams();
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ['user', id], 
    queryFn: () => userService.get(id), 
    retry: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return <User user={user} handleLogout={handleLogout} />
};

export default UserView;