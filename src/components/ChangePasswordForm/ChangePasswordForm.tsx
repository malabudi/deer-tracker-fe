'use client';
import { useEffect, useRef, useState } from 'react';
import ActiveButton from '../Active-Button/ActiveButton';
import InputField from '../textbox/textbox';
import styles from './page.module.css';
import {
  validateConfirmPassword,
  validatePassword,
} from '@/lib/fieldValidator';
import { getUserById, updateUserPassword } from '@/hooks/apis/users';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDarkMode from '@/hooks/useDarkMode';
import { canParseJson } from '@/utils/helpers';
import { Bounce } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loader from '../loader/Loader';

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let originalEmail = useRef<string>('');

  const isDarkMode = useDarkMode();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const fetchEmail = async () => {
        setIsLoading(true);
        try {
          const res = await getUserById(session['user']['id']);
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

  useEffect(() => {
    setIsSaveEnabled(
      currentPassword !== '' && newPassword !== '' && confirmPassword !== ''
    );
  }, [currentPassword, newPassword, confirmPassword]);

  const handleCurrentPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const onSave = async () => {
    const passwordErr = validatePassword(newPassword);
    const confirmPasswordErr = validateConfirmPassword(
      newPassword,
      confirmPassword
    );

    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);

    // Stop submission if there are any errors
    if (passwordErr || confirmPasswordErr) {
      return;
    }

    try {
      const response = await updateUserPassword(
        originalEmail.current,
        currentPassword,
        newPassword
      );

      if (response.success) {
        toast.success('Password successfully updated', {
          position: 'bottom-right',
          autoClose: 10000,
          hideProgressBar: false,
          theme: isDarkMode ? 'dark' : 'light',
          transition: Bounce,
        });

        // Navigate back to the previous page after a short delay
        setTimeout(() => {
          router.back();
        }, 1000);
      } else {
        const errorMessage = response.error || 'An unexpected error occurred';
        toast.error(errorMessage, {
          position: 'bottom-right',
          autoClose: 10000,
          hideProgressBar: false,
          theme: isDarkMode ? 'dark' : 'light',
          transition: Bounce,
        });
      }
    } catch (err: any) {
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
          theme: isDarkMode ? 'dark' : 'light',
          transition: Bounce,
        });
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.formContainer}>
          <div className={styles.inputContainer}>
            <InputField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              placeholder="Enter Current password"
            />

            <InputField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="Enter new password"
              errMessage={passwordError}
            />

            <InputField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Re-Enter new password"
              errMessage={confirmPasswordError}
            />
          </div>
          <ActiveButton
            isdisabled={!isSaveEnabled}
            text="Save"
            onClick={onSave}
          />
          <ToastContainer />
        </div>
      )}
    </>
  );
}
