'use client';
import React, { useState } from 'react';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import InactiveButton from '@/components/Inactive-Button/InactiveButton';
import InputField from '@/components/Input-textbox/textbox';
import styles from './page.module.css';
import { emailRegex } from '@/utils/constants';

const isValidEmail = (email: string) => {
  return emailRegex.test(email);
};

const LoginPage: React.FC = () => {
  // State for email and password

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  // Handlers for input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Validate email on change
    if (!isValidEmail(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check validation on submit
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
    }
  };

  return (
    <main className={styles.mainpageContainer}>
      <div className={styles.headerconatiner}>
        <h1 className={styles.welcomeBackcontainer}>Welcome Back!</h1>
      </div>
      {/* Email and Password Input Fields */}
      <form onSubmit={handleSubmit}>
        <div className={styles.EmailContainer}>
          <label className={styles.label}>Email</label>
          <InputField
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email"
          />
          {emailError && <p className={styles.Err}>{emailError}</p>}{' '}
        </div>

        <div className={styles.PasswordContainer}>
          <label className={styles.label}>Password</label>
          <InputField
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
          />

          {/* Show password error */}
        </div>

        {/* Buttons for Login and Signup */}
        <div className={styles.lgnbttncontainer}>
          <ActiveButton
            text="Log in"
            onClick={() => console.log('Login button clicked!')}
          />
        </div>
        <span className={styles.span}>or</span>

        <div className={styles.signbttncontainer}>
          <InactiveButton
            text="Sign up"
            onClick={() => console.log('Signup button clicked!')}
          />
        </div>
      </form>
    </main>
  );
};

export default LoginPage;
