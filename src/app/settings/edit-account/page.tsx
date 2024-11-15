'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import InputField from '@/components/textbox/textbox';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import Image from 'next/image';
import backIcon from '@/assets/BackArrow.svg';
import Link from 'next/link';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import useDarkMode from '@/hooks/useDarkMode';
import 'react-toastify/dist/ReactToastify.css';
import { validateEmail } from '@/lib/fieldValidator';
import { getUserById, updateUserEmail } from '@/hooks/apis/users';
import { canParseJson } from '@/utils/helpers';
import { generateTokenAndEmail } from '@/lib/generateVerification';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loader from '@/components/loader/Loader';

const Editaccount: React.FC = () => {
  const { data: session } = useSession();
  const [newEmail, setEmail] = useState('');
  const [isEmailMatch, setIsEmailChanged] = useState(false);
  const [emailError, setEmailError] = useState('');
  const isDarkMode = useDarkMode();
  const router = useRouter();
  let originalEmail = useRef<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const fetchEmail = async () => {
        setIsLoading(true);
        try {
          const res = await getUserById(session['user']['id']);
          setEmail(res.email);
          originalEmail.current = res.email;
        } catch (err) {
          console.error("Error fetching user's email:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchEmail();
    }
  }, [session]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailChanged(value !== originalEmail.current);
    setEmailError('');
  };

  const handleSave = async () => {
    const emailErr = validateEmail(newEmail);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }

    try {
      const response = await updateUserEmail(originalEmail.current, newEmail);

      if (response.success) {
        // Send verification email
        const verificationToken = await generateTokenAndEmail(newEmail);

        if (!verificationToken.error) {
          toast.success(
            'A Verification Email Has Been Sent to your Email Address',
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
          // Navigate back to the previous page after showing the success toast
          setTimeout(() => {
            router.back();
          }, 10000);
        } else {
          toast.error(
            'An unexpected error occurred while sending the verification email',
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
        setIsEmailChanged(false);
      } else {
        const data = await response.json();
        const errorMessage = data.error || 'An unexpected error occurred';
        toast.error(errorMessage, {
          position: 'bottom-right',
          autoClose: 10000,
          hideProgressBar: false,
          theme: isDarkMode ? 'dark' : 'light',
          transition: Bounce,
        });
      }
    } catch (err) {
      let errMsg;
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
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Link href="/settings">
            <Image
              priority
              src={backIcon}
              alt="Back"
              className={styles.backButtonImage}
              style={{ filter: 'var(--image-filter)' }}
            />
          </Link>
          <div className={styles.mainConatiner}>
            <h1>Edit Account</h1>
            <div className={styles.formContainer}>
              <div>
                <label>Email</label>
                <InputField
                  type="email"
                  value={newEmail}
                  onChange={handleEmailChange}
                  placeholder="Enter email"
                  errMessage={emailError}
                />

                <Link href="/settings/edit-account/edit-password">
                  <ActiveButton text="Change Password" />
                </Link>
              </div>
              <ActiveButton
                isdisabled={!isEmailMatch}
                text="Save"
                onClick={handleSave}
              />
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </div>
  );
};

export default Editaccount;
