'use client';
import { useEffect, useState } from 'react';
import ActiveButton from '../Active-Button/ActiveButton';
import InputField from '../textbox/textbox';
import styles from './page.module.css';
import {
  validateConfirmPassword,
  validatePassword,
} from '@/lib/fieldValidator';
import { updateUserPassword } from '@/hooks/apis/users';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDarkMode from '@/hooks/useDarkMode';
import { canParseJson } from '@/utils/helpers';
import { Bounce } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/utils/helpers';

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  const isDarkMode = useDarkMode();
  const router = useRouter();
  const userEmail = getCookie('userEmail'); // Get email from cookie

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
        userEmail,
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
        }, 10000);
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

  useEffect(() => {
    setIsSaveEnabled(
      currentPassword !== '' && newPassword !== '' && confirmPassword !== ''
    );
  }, [currentPassword, newPassword, confirmPassword]);

  return (
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
      <ActiveButton isdisabled={!isSaveEnabled} text="Save" onClick={onSave} />
      <ToastContainer />
    </div>
  );
}
