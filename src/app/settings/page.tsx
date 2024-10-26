'use client';
import { useState, useEffect } from 'react';
import BottomNav from '@/components/bottom-nav/BottomNav';

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <>
      <h1>Settings</h1>
      <button onClick={toggleDarkMode} className="toggle-switch">
        <span className={`switch ${isDarkMode ? 'dark' : 'light'}`} />
      </button>
      <BottomNav />
    </>
  );
}
