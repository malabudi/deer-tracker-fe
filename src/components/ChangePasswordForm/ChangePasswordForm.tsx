import { useEffect, useState } from 'react';
import ActiveButton from '../Active-Button/ActiveButton';
import InputField from '../textbox/textbox';
import styles from './page.module.css';
import {
  validateConfirmPassword,
  validatePassword,
} from '@/lib/fieldValidator';

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState<string | null>('');
  const [newPassword, setNewPassword] = useState<string | null>('');
  const [confirmPassword, setConfirmPassword] = useState<string | null>('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOldPassword(value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
  };

  const onSave = () => {
    const passwordErr = validatePassword(newPassword);
    const confirmPasswordErr = validateConfirmPassword(
      newPassword,
      confirmPassword
    );

    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);
  };

  useEffect(() => {
    setIsSaveEnabled(
      newPassword !== '' && confirmPassword !== '' && oldPassword !== ''
    );
  }, [newPassword, confirmPassword, oldPassword]);

  return (
    <div className={styles.formContainer}>
      <div className={styles.inputContainer}>
        <InputField
          label="Old Password"
          type="password"
          value={oldPassword}
          onChange={handleOldPasswordChange}
          placeholder="Enter old password"
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
    </div>
  );
}
