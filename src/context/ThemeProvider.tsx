'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCookie } from '@/utils/helpers'; // Ensure you have a function to get cookies
import Loader from '@/components/loader/Loader';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookieTheme = getCookie('theme');
    if (cookieTheme) {
      setTheme(cookieTheme);
    } else {
      setTheme('light');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (theme) {
      // Dark themes
      document.body.className = theme;

      document.body.style.setProperty(
        '--icon-color',
        theme === 'dark' ? '#ffffff' : '#000000'
      );

      document.body.style.setProperty(
        '--image-filter',
        theme === 'dark' ? 'invert(0)' : 'invert(1)'
      );

      document.cookie = `theme=${theme}; path=/; max-age=${365 * 24 * 60 * 60}`; // Set the cookie
    }
  }, [theme]);

  // If loading, return null (or a loader component) until theme is determined
  if (loading) {
    return <Loader />;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
