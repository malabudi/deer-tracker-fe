'use client';

import React from 'react';
import BottomNav from '@/components/bottom-nav/BottomNav';
import styles from './page.module.css';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import RadioButton from '@/components/Radio-Button/RadioButton';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useTheme } from '@/context/ThemeProvider';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
  };

  const handleSignOut = () => {
    signOut({
      callbackUrl: '/', // Redirect to homepage after sign out
    });
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.settingpageContainer}>
        <h1 className={styles.settings}>Settings</h1>
        <div className={styles.settingsWrapper}>
          <h2 className={styles.SectionLabel}>Account</h2>
          <div className={styles.EditAccountContainer}>
            <Link
              href="settings/edit-account"
              passHref
              className={styles.editAccLink}
            >
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
              label={<span>Dark</span>}
              name="theme"
              value="dark"
              checked={theme === 'dark'}
              onChange={handleThemeChange}
            />
            <RadioButton
              label={<span>Light</span>}
              name="theme"
              value="light"
              checked={theme === 'light'}
              onChange={handleThemeChange}
            />
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
