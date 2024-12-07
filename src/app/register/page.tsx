'use client';
import React, { useEffect, useState } from 'react';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import InactiveButton from '@/components/Inactive-Button/InactiveButton';
import InputField from '@/components/textbox/textbox';
import styles from './page.module.css';
import { signUp, logIn } from '@/utils/constants';
import Link from 'next/link';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import useDarkMode from '@/hooks/useDarkMode';
import 'react-toastify/dist/ReactToastify.css';
import { createUser } from '@/hooks/apis/users';
import { generateTokenAndEmail } from '@/lib/generateVerification';
import { canParseJson } from '@/utils/helpers';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from '@/lib/fieldValidator';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const isDarkMode = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

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
      setIsLoading(true);

      const signupRes = await createUser(email, password);

      if (signupRes.success) {
        const verificationToken = await generateTokenAndEmail(email);
        setIsLoading(false);

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
        setIsLoading(false);
        toast.error(
          'An unexpected error occured while creating your account, please try again later',
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
    } catch (err) {
      setIsLoading(false);
      let errMsg;
      console.log(canParseJson(err.message));

      if (canParseJson(err.message)) {
        errMsg = JSON.parse(err.message);
        toast.error(errMsg.error, {
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
        errMsg = err.message;
        toast.error(errMsg, {
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
          <ActiveButton text={signUp} isDisabled={isLoading} />
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

export default RegisterPage;
