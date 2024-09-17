// src/hooks/TestUseLogin.tsx
'use client';

import React, { useEffect, useState } from 'react';
import useLogin from '@/hooks/useLogin';

const TestUseLogin: React.FC = () => {
  const { user, error, loading, login } = useLogin();
  const [email, setEmail] = useState('email08@te978sting.com'); // Default valid email
  const [password, setPassword] = useState('teste4test'); // Default valid password

  const handleLogin = () => {
    login(email, password);
  };

  useEffect(() => {}, [login]);

  return (
    <div>
      <h2>Test Login Hook</h2>
      <div>
        <label>Email:</label>
        <input
          type="text"
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
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!error &&
        user && ( // Only show user info if no error and user is present
          <div>
            <h3>User Information:</h3>
            <p>Logged in as: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Phone Number: {user.phone_number}</p>
            <p>Created Date: {user.created_at}</p>
            <p>Last Updated Date: {user.updated_at}</p>
            <p>User ID: {user.user_id}</p>
          </div>
        )}
    </div>
  );
};

export default TestUseLogin;
