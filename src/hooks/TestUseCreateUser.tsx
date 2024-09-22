'use client';

import React, { useState } from 'react';
import useCreateUser from '@/hooks/useCreateUser'; // Adjust the path as needed

const TestUseCreateUser: React.FC = () => {
  const { userId, error, loading, success, createUser } = useCreateUser();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Handle user creation
  const handleCreateUser = () => {
    createUser({
      username,
      email,
      password,
      phone_number: phoneNumber,
    });
  };

  return (
    <div>
      <h2>Test Create User Hook</h2>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter phone number (optional)"
        />
      </div>
      <button onClick={handleCreateUser} disabled={loading}>
        {loading ? 'Creating User...' : 'Create User'}
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {userId && ( // Show user ID if available
        <div>
          <h3>User Information:</h3>
          <p>User ID: {userId}</p>
        </div>
      )}
    </div>
  );
};

export default TestUseCreateUser;
