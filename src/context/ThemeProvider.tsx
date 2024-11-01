'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    document.body.className = theme;

    // "style" basically is used to declare variables in CSS
    document.body.style.setProperty(
      '--icon-color',
      theme === 'dark' ? '#ffffff' : '#000000'
    );

    document.body.style.setProperty(
      '--image-filter',
      theme === 'dark' ? 'invert(0)' : 'invert(1)'
    );

    localStorage.setItem('theme', theme);

    // Listen for changes in preference
    const listener = (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme); // Save the preference
    };

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', listener);

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', listener);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
