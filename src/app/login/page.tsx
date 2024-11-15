'use client';
import React, { useEffect, useState } from 'react';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import InactiveButton from '@/components/Inactive-Button/InactiveButton';
import InputField from '@/components/textbox/textbox';
import styles from './page.module.css';
import { logIn, signUp } from '@/utils/constants';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import useDarkMode from '@/hooks/useDarkMode';
import 'react-toastify/dist/ReactToastify.css';
import { validateEmail, validatePassword } from '@/lib/fieldValidator';

const LoginPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(' ');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();
  const isDarkMode = useDarkMode();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      router.push(`/settings`);
    }
  }, [session, status, router]);

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

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    // Stop submission if there are any errors
    if (emailErr || passwordErr) {
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
      console.log(result.error);
      toast.error(result.error, {
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
    } else {
      console.log('Login successful');
    }
  };

  return (
    <div className={styles.loginPageContainer}>
      <h1 className={styles.welcomeBack}>Welcome Back!</h1>
      <form onSubmit={handleSubmit} noValidate className={styles.formContainer}>
        {/* hidden field needed for authentication action */}
        <input type="hidden" name="action" value="login" />
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

        <div className={styles.btnContainer}>
          <ActiveButton text={logIn} />
          <span className={styles.span}>or</span>
          <Link href="/signup" passHref>
            <InactiveButton text={signUp} />
          </Link>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
