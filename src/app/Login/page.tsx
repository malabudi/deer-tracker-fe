'use client';
import React, { useState } from 'react';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import InactiveButton from '@/components/Inactive-Button/InactiveButton';
import InputField from '@/components/textbox/textbox';
import styles from './page.module.css';
import { emailRegex } from '@/utils/constants';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, EsetError] = useState(' ');
  const [passError, PsetError] = useState(' ');
  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakePassword, setShakePassword] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    EsetError('');
    PsetError('');
    setShakeEmail(false);
    setShakePassword(false);

    let valid = true;

    if (!email) {
      EsetError('Email cannot be empty.');
      setShakeEmail(true);
      valid = false;
    } else if (!emailRegex.test(email)) {
      EsetError('Invalid email address.');
      setShakeEmail(true);
      valid = false;
    }

    if (!password) {
      PsetError('Password cannot be empty.');
      setShakePassword(true);
      valid = false;
    }

    if (!valid) {
      setTimeout(() => {
        setShakeEmail(false);
        setShakePassword(false);
      }, 100);
      return;
    }
  };

  return (
    <main className={styles.loginPageContainer}>
      <div className={styles.headerconatiner}>
        <h1 className={styles.welcomeBack}>Welcome Back!</h1>
      </div>
      {/* Email and Password Input Fields */}
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.EmailContainer}>
          <label className={styles.TextBoxLabel}>Email</label>
          <InputField
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email"
            label="Password"
            errorMessage={emailError}
            shake={shakeEmail}
          />
        </div>

        <div className={styles.PasswordContainer}>
          <label className={styles.TextBoxLabel}>Password</label>
          <InputField
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
            label="Password"
            errorMessage={passError}
            shake={shakePassword}
          />
        </div>

        {/* Buttons for Login and Signup */}
        <div className={styles.lgnbttncontainer}>
          <ActiveButton text="Log in" />
        </div>
        <span className={styles.span}>or</span>

        <div className={styles.signbttncontainer}>
          <InactiveButton text="Sign up" />
        </div>
      </form>
    </main>
  );
};

export default LoginPage;
