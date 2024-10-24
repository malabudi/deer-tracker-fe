'use client';
import React, { useState } from 'react';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import InactiveButton from '@/components/Inactive-Button/InactiveButton';
import InputField from '@/components/textbox/textbox';
import styles from './page.module.css';
import { emailRegex } from '@/utils/constants';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRedirectIfAuthed } from '@/hooks/useRedirect';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, EsetError] = useState(' ');
  const [passError, PsetError] = useState(' ');
  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakePassword, setShakePassword] = useState(false);
  const router = useRouter();

  // if user is already authenticated, redirect to settings page
  useRedirectIfAuthed('/settings');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Authenticate once valid
    const result = await signIn('credentials', {
      email: email,
      password: password,
      action: 'login',
      redirect: false,
    });

    if (result?.error) {
      PsetError('Incorrect email or password');
      setShakeEmail(true);
      setShakePassword(true);
    } else {
      router.push('/settings');
    }
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.headerconatiner}>
        <h1 className={styles.welcomeBack}>Welcome Back!</h1>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        {/* hidden field needed for authentication action */}
        <input type="hidden" name="action" value="login" />
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

        <div className={styles.lgnbttncontainer}>
          <ActiveButton text="Log in" />
        </div>
        <span className={styles.span}>or</span>

        <div className={styles.signbttncontainer}>
          <Link href="/signup" passHref>
            <InactiveButton text="Sign up" />
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
