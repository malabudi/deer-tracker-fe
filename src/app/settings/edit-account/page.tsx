'use client';
import React, { useState } from 'react';
import styles from './page.module.css';
import InputField from '@/components/textbox/textbox';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import Image from 'next/image';
import backIcon from '@/assets/BackArrow.svg';
import Link from 'next/link';

const Editaccount: React.FC = () => {
  const userEmail = 'Deerbuttcheeks@gmail.com';
  const [email, setEmail] = useState(userEmail);
  const [isEmailMatch, setIsEmailMatch] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailMatch(value !== userEmail);
  };
  return (
    <div>
      <Link href="/settings">
        <Image
          priority
          src={backIcon}
          alt="Back"
          className={styles.backButtonImage}
        />
      </Link>
      <div className={styles.mainConatiner}>
        <h1 className={styles.editAccountHeader}>Edit Account</h1>
        <div className={styles.formContainer}>
          <div>
            <label>Email</label>
            <InputField
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter email"
            />

            <ActiveButton text="Change Password" />
          </div>
          <ActiveButton
            isdisabled={!isEmailMatch}
            text="Save"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
export default Editaccount;
