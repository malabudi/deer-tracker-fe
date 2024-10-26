'use client';
import React, { useState } from 'react';
import styles from './page.module.css';
import InputField from '@/components/textbox/textbox';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import { emailRegex } from '@/utils/constants';
import Image from 'next/image';
import backIcon from '@/assets/BackArrow.svg';

import Link from 'next/link';

const Editaccount: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Validate email when user types
    if (emailRegex.test(value)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
  };
  return (
    <div className={styles.editaccountconatiner}>
      <div className={styles.backButtonContainer}>
        <Link href="/settings">
          <Image
            priority
            src={backIcon}
            alt="Back"
            className={styles.backButtonImage}
          />
        </Link>
      </div>
      <h1 className={styles.editAccounth1}>Edit Account</h1>
      <div className={styles.inputfieldContainer}>
        <InputField
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter email"
          label="Password"
        />
      </div>
      <div className={styles.changeEmailContainer}>
        <ActiveButton text="Change Email" />
      </div>

      <div
        className={`${styles.savebttnContainer} ${isEmailValid ? styles.active : styles.disabled}`}
      >
        <ActiveButton text="Save" onClick={() => {}} />
      </div>
    </div>
  );
};
export default Editaccount;
