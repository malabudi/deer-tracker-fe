'use client';

import React, { useState } from 'react';
import useCreateUser from '@/hooks/useCreateUser';

const TestUseCreateUser: React.FC = () => {
  const { createUser } = useCreateUser(); // Hook without state management
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [loading, setLoading] = useState<boolean>(false); // Local loading state
  const [error, setError] = useState<string | null>(null); // Local error state
  const [success, setSuccess] = useState<string | null>(null); // Local success state
  const [userId, setUserId] = useState<string | null>(null); // Store userId locally

  const handleCreateUser = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await createUser({
        username,
        email,
        password,
        phone_number: phoneNumber,
      });
      setUserId(data.id); // Store the returned user ID
      setSuccess('User added successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

      {userId && (
        <div>
          <h3>User Information:</h3>
          <p>User ID: {userId}</p>
        </div>
      )}
    </div>
  );
};

export default TestUseCreateUser;
