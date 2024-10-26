'use client';
import React, { useState } from 'react';
import BottomNav from '@/components/bottom-nav/BottomNav';
import styles from './page.module.css';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import RadioButton from '@/components/Radio-Button/RadioButton';
import ToggleSwitch from '@/components/Toggle-Button/ToggleButton';
import Link from 'next/link';

export default function Settings() {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [isToggled, setIsToggled] = useState(false);

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTheme(event.target.value);
  };
  const handleToggle = () => {
    setIsToggled(!isToggled);
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
            <ActiveButton text="Log out" />
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
          <hr className={styles.lineSpliter}></hr>
          <h2 className={styles.SectionLabel}>Notifications</h2>
          <ToggleSwitch isOn={isToggled} handleToggle={handleToggle} />
        </div>
      </div>
      <BottomNav />
    </>
  );
}
