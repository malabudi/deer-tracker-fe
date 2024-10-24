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
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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

  const { data: session } = useSession();
  const router = useRouter();

  // if user is already authenticated, redirect to settings page
  if (session) {
    router.push('/settings');
    return null;
  }

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

  const validateFields = () => {
    let isValid = true;

    // Validate email
    if (!email) {
      EsetError('Email cannot be empty.');
      setShakeEmail(true);
      isValid = false;
    } else if (!emailRegex.test(email)) {
      EsetError('Invalid email address.');
      setShakeEmail(true);
      isValid = false;
    }

    // Validate password
    if (!password) {
      PsetError('Password cannot be empty.');
      setShakePassword(true);
      isValid = false;
    }

    // Validate confirm password
    if (!confirmpassword) {
      confirmPsetError('Please confirm password.');
      setShakeConfirmPassword(true);
      isValid = false;
    } else if (password !== confirmpassword) {
      confirmPsetError('Passwords does not match.');
      setShakeConfirmPassword(true);
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear errors
    EsetError('');
    PsetError('');
    confirmPsetError('');
    setShakeEmail(false);
    setShakePassword(false);
    setShakeConfirmPassword(false);

    // Password errors
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

    if (!validateFields()) {
      setTimeout(() => {
        setShakeEmail(false);
        setShakePassword(false);
        setShakeConfirmPassword(false);
      }, 100);
      return;
    }

    // Authenticate once valid
    try {
      const result = await signIn('credentials', {
        email: email,
        password: password,
        action: 'signup',
        redirect: false,
      });

      if (result?.error) {
        confirmPsetError('Unable to create account, please try again later');
        setShakeConfirmPassword(true);
      } else {
        router.push('/settings');
      }
    } catch (error) {
      console.error('An error occurred during signup:', error);
      confirmPsetError('An unexpected error occurred. Please try again.');
      setShakeConfirmPassword(true);
    }
  };

  return (
    <main className={styles.SignUpPageContainer}>
      <div className={styles.headerconatiner}>
        <h1 className={styles.CreateAccount}>Create Account</h1>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        {/* hidden field needed for authentication action */}
        <input type="hidden" name="action" value="signup" />
        <div className={styles.EmailContainer}>
          <InputField
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email"
            label="Email"
            errorMessage={emailError}
            shake={shakeEmail}
          />
        </div>

        <div className={styles.PasswordContainer}>
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
          <InputField
            type="password"
            value={confirmpassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Re-Enter password"
            label="Confirm Password"
            errorMessage={ConfirmpassError}
            shake={shakeConfirmPass}
          />
        </div>

        <div className={styles.signbttncontainer}>
          <InactiveButton text="Sign up" />
        </div>
        <span className={styles.span}>or</span>

        <div className={styles.lgnbttncontainer}>
          <Link href="/login" passHref>
            <ActiveButton text="Log in" />
          </Link>
        </div>
      </form>
    </main>
  );
};

export default SignupPage;
