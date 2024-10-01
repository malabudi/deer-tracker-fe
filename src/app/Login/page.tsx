'use client';
import React, { useState } from 'react';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import InactiveButton from '@/components/Inactive-Button/InactiveButton';
import InputField from '@/components/textbox/textbox';
import styles from './page.module.css';
import { emailRegex } from '@/utils/constants';

const LoginPage: React.FC = () => {
  // State for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailerror, EsetError] = useState(' ');
  const [passerror, PsetError] = useState(' ');
  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakePassword, setShakePassword] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!value) {
      EsetError('Email cannot be empty.');
    } else if (!emailRegex.test(value)) {
      EsetError('Invalid email address.');
    } else {
      EsetError(''); // Clear error if valid
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (!value) {
      PsetError('Password cannot be empty.');
    } else {
      PsetError(''); // Clear error if valid
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset error messages
    EsetError('');
    PsetError('');
    setShakeEmail(false);
    setShakePassword(false);

    let valid = true; // To track overall validity

    if (!email) {
      EsetError('Email cannot be empty.');
      setShakeEmail(true); // Trigger shake for email
      valid = false;
    } else if (!emailRegex.test(email)) {
      EsetError('Invalid email address.');
      setShakeEmail(true); // Trigger shake for email
      valid = false;
    }

    if (!password) {
      PsetError('Password cannot be empty.');
      setShakePassword(true); // Trigger shake for password

      valid = false;
    }
    if (!valid) {
      // Reset shake state after animation duration
      setTimeout(() => {
        setShakeEmail(false);
        setShakePassword(false);
      }, 100); // Match this duration with your CSS animation duration
      return;
    }
  };

  return (
    <main className={styles.loginPageContainer}>
      <meta
        name="viewport"
        content="width=device-width, height=device-height, initial-scale=1"
      ></meta>
      <div className={styles.headerconatiner}>
        <h1 className={styles.welcomeBackcontainer}>Welcome Back!</h1>
      </div>
      {/* Email and Password Input Fields */}
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.EmailContainer}>
          <label className={styles.label}>Email</label>
          <InputField
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email"
          />
          {emailerror && (
            <div className={`${styles.Err} ${shakeEmail ? styles.shake : ''}`}>
              {emailerror}
            </div>
          )}
        </div>

        <div className={styles.PasswordContainer}>
          <label className={styles.label}>Password</label>
          <InputField
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
          />
          {passerror && (
            <div
              className={`${styles.Err} ${shakePassword ? styles.shake : ''}`}
            >
              {passerror}
            </div>
          )}
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
