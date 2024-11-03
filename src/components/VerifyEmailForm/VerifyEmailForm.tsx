'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Loader from '../loader/Loader';
import { newVerification } from '@/actions/new-verification';
import ActiveButton from '../Active-Button/ActiveButton';
import Link from 'next/link';
import styles from './page.module.css';
import { generateTokenAndEmail } from '@/lib/generateVerification';
import { getVerificationTokenByToken } from '@/hooks/apis/verificationToken';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDarkMode from '@/hooks/useDarkMode';
import { logIn } from '@/utils/constants';

const VerifyEmailForm = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isRegernating, setIsRegenrating] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const isDarkMode = useDarkMode();

  const handleRegenerateToken = async () => {
    setIsRegenrating(true);
    console.log(isRegernating); // temp (removed once moe's pr is done)

    try {
      const tokenBody = await getVerificationTokenByToken(token);
      await generateTokenAndEmail(tokenBody.email);

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

      setIsRegenrating(false);
    } catch (error) {
      console.error('Error while regenerating token:', error);

      toast.error(error.message, {
        position: 'bottom-right',
        autoClose: 20000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? 'dark' : 'light',
        transition: Bounce,
      });

      setIsRegenrating(false);
    }
  };

  const onLoad = useCallback(() => {
    if (success || error) {
      return;
    }

    if (!token) {
      setError('No token provided');
      return;
    }

    newVerification(token)
      .then((res) => {
        if (res.success) {
          setSuccess(res.success);
        }

        if (res.error) {
          setError(res.error);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('An unexpected error occured while verifying email');
      });
  }, [success, error, token]);

  useEffect(() => {
    onLoad();
  }, [onLoad, token]);

  return (
    <div className={styles.mainContainer}>
      <>
        {!success && !error && <Loader />}
        {success && (
          <div className={styles.messageContainer}>
            <h1>Email Verification</h1>
            <h2>Your email is verified, you can now sign in!</h2>
            <Link href="/login" passHref>
              <ActiveButton text={logIn} />
            </Link>
          </div>
        )}
        {!success && error && (
          <div className={styles.messageContainer}>
            <h1>Email Verification</h1>
            <h2>{error}</h2>
            <ActiveButton
              text={'Resend Link'}
              onClick={handleRegenerateToken}
            />
          </div>
        )}
      </>
      <ToastContainer />
    </div>
  );
};

export default VerifyEmailForm;
