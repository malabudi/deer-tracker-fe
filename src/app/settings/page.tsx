'use client';
import React, { useState } from 'react';
import BottomNav from '@/components/bottom-nav/BottomNav';
import styles from './page.module.css';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import RadioButton from '@/components/Radio-Button/RadioButton';
import Link from 'next/link';

import { signOut } from 'next-auth/react';

export default function Settings() {
  const [selectedTheme, setSelectedTheme] = useState('');

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTheme(event.target.value);
  };

  const handleSignOut = () => {
    signOut({
      callbackUrl: '/', // Redirect to homepage after sign out
    });
  };

  return (
    <>
      <div className={styles.settingpageContainer}>
        <h1 className={styles.settings}>Settings</h1>
        <div>
          <h2 className={styles.SectionLabel}>Account</h2>
          <div className={styles.EditAccountContainer}>
            <Link href="settings/edit-email" passHref>
              <ActiveButton text="Edit Account" />
            </Link>
          </div>
          <div className={styles.LogoutContainer}>
            <ActiveButton text="Log out" onClick={handleSignOut} />
          </div>
          <hr className={styles.lineSpliter}></hr>
          <h2 className={styles.SectionLabel}>Theme</h2>
          <div className={styles.radiobttnsContainer}>
            <RadioButton
              label={<span className={styles.labelText}>Dark</span>}
              name="theme"
              value="dark"
              checked={selectedTheme === 'dark'}
              onChange={handleThemeChange}
            />
            <RadioButton
              label={<span className={styles.labelText}>Light</span>}
              name="theme"
              value="light"
              checked={selectedTheme === 'light'}
              onChange={handleThemeChange}
            />
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
