'use client';
import React, { useState } from 'react';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import InactiveButton from '@/components/Inactive-Button/InactiveButton';
import InputField from '@/components/textbox/textbox';
import styles from './page.module.css';
import { signUp, logIn } from '@/utils/constants';
import Link from 'next/link';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import useDarkMode from '@/hooks/useDarkMode';
import 'react-toastify/dist/ReactToastify.css';
import { useRedirectIfAuthed } from '@/hooks/useRedirect';
import { createUser } from '@/hooks/apis/users';
import { generateTokenAndEmail } from '@/lib/generateVerification';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from '@/lib/fieldValidator';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const isDarkMode = useDarkMode();

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

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setconfirmPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(
      password,
      confirmpassword
    );

    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);

    // Stop submission if there are any errors
    if (emailErr || passwordErr || confirmPasswordErr) {
      return;
    }

    // Create account once valid and send verification email
    try {
      const signupRes = await createUser(email, password);

      if (signupRes.success) {
        const verificationToken = await generateTokenAndEmail(email);

        if (!verificationToken.error) {
          toast.success(
            'A Verification Email Has Been Sent to your Email Address',
            {
              position: 'bottom-right',
              autoClose: 20000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: isDarkMode ? 'dark' : 'light',
              transition: Bounce,
            }
          );
        } else {
          toast.error(
            'An unexpected error occured while sending the verification email',
            {
              position: 'bottom-right',
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: isDarkMode ? 'dark' : 'light',
              transition: Bounce,
            }
          );
        }
      } else {
        toast.error('Unable to create account at this time', {
          position: 'bottom-right',
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDarkMode ? 'dark' : 'light',
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Server is unavailable', {
        position: 'bottom-right',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? 'dark' : 'light',
        transition: Bounce,
      });
    }
  };

  return (
    <div className={styles.SignUpPageContainer}>
      <h1 className={styles.CreateAccount}>Create Account</h1>
      <form onSubmit={handleSubmit} noValidate className={styles.formContainer}>
        <InputField
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter email"
          label="Email"
          errMessage={emailError}
        />

        <InputField
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter password"
          label="Password"
          errMessage={passwordError}
        />

        <InputField
          type="password"
          value={confirmpassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Re-Enter password"
          label="Confirm Password"
          errMessage={confirmPasswordError}
        />

        <div className={styles.btnContainer}>
          <ActiveButton text={signUp} />
          <span className={styles.span}>or</span>
          <Link href="/login" passHref>
            <InactiveButton text={logIn} />
          </Link>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignupPage;
