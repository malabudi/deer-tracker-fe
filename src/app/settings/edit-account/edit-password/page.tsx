'use client';
import React from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import backIcon from '@/assets/BackArrow.svg';
import Link from 'next/link';
import ChangePasswordForm from '@/components/ChangePasswordForm/ChangePasswordForm';

const EditPassword: React.FC = () => {
  return (
    <div>
      <Link href="/settings/edit-account">
        <Image
          priority
          src={backIcon}
          alt="Back"
          className={styles.backButtonImage}
          style={{ filter: 'var(--image-filter)' }}
        />
      </Link>
      <div className={styles.mainContainer}>
        <h1>Edit Password</h1>
        <ChangePasswordForm />
      </div>
    </div>
  );
};
export default EditPassword;
