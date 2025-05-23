import React from 'react';
import useAuthStatus from '../hooks/useAuthStatus';

const Dashboard: React.FC = () => {
  const { user } = useAuthStatus();

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <p>Welcome, {user.email}!</p>
      ) : (
        <p>You need to be logged in to view this page.</p>
      )}
      {/* Add more dashboard content here */}
    </div>
  );
};

export default Dashboard;