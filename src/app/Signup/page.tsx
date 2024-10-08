'use client';
import React, { useState } from 'react';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import InactiveButton from '@/components/Inactive-Button/InactiveButton';
import InputField from '@/components/textbox/textbox';
import styles from './page.module.css';
import {
  emailRegex,
  minLengthRegex,
  containsLowerLetterRegex,
  containsUpperLetterRegex,
  containsNumberRegex,
  containsSpecialCharRegex,
} from '@/utils/constants';
import Link from 'next/link';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [emailError, EsetError] = useState(' ');
  const [passError, PsetError] = useState(' ');
  const [ConfirmpassError, confirmPsetError] = useState(' ');
  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakePassword, setShakePassword] = useState(false);
  const [shakeConfirmPass, setShakeConfirmPassword] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setconfirmPassword(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    EsetError('');
    PsetError('');
    confirmPsetError('');
    setShakeEmail(false);
    setShakePassword(false);
    setShakeConfirmPassword(false);

    let valid = true;

    // Validate email
    if (!email) {
      EsetError('Email cannot be empty.');
      setShakeEmail(true);
      valid = false;
    } else if (!emailRegex.test(email)) {
      EsetError('Invalid email address.');
      setShakeEmail(true);
      valid = false;
    }

    // Validate password
    if (!password) {
      PsetError('Password cannot be empty.');
      setShakePassword(true);
      valid = false;
    }

    // Validate confirm password
    if (!confirmpassword) {
      confirmPsetError('Please confirm password.');
      setShakeConfirmPassword(true);
      valid = false;
    } else if (password !== confirmpassword) {
      confirmPsetError('Passwords does not match.');
      setShakeConfirmPassword(true);
      valid = false;
    }
    let errors = [];

    if (!minLengthRegex.test(password)) {
      errors.push('* must contain min. 8 characters');
    }
    if (!containsUpperLetterRegex.test(password)) {
      errors.push('* must contain min. 1 upper case');
    }
    if (!containsLowerLetterRegex.test(password)) {
      errors.push('* must contain min. 1 lower case');
    }
    if (!containsNumberRegex.test(password)) {
      errors.push('* must contain min. 1 number');
    }
    if (!containsSpecialCharRegex.test(password)) {
      errors.push('* must contain min. 1 special character');
    }
    if (errors.length > 0) {
      PsetError(errors.join('\n'));
      setShakePassword(true);
    } else {
      PsetError('');
      setShakePassword(false);
    }

    if (!valid) {
      setTimeout(() => {
        setShakeEmail(false);
        setShakePassword(false);
        setShakeConfirmPassword(false);
      }, 100);
      return;
    }
  };

  return (
    <main className={styles.SignUpPageContainer}>
      <div className={styles.headerconatiner}>
        <h1 className={styles.CreateAccount}>Create Account</h1>
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

        <div className={styles.ConfirmPasswordContainer}>
          <label className={styles.TextBoxLabel}>Confirm Password</label>
          <InputField
            type="password"
            value={confirmpassword}
            onChange={handleConfirmPasswordChange}
            placeholder="confirm password"
            label="Password"
            errorMessage={ConfirmpassError}
            shake={shakeConfirmPass}
          />
        </div>

        {/* Buttons for Login and Signup */}
        <div className={styles.signbttncontainer}>
          <InactiveButton text="Sign up" />
        </div>
        <span className={styles.span}>or</span>

        <div className={styles.lgnbttncontainer}>
          <Link href="/Login" passHref>
            <ActiveButton text="Log in" />
          </Link>
        </div>
      </form>
    </main>
  );
};

export default SignupPage;
