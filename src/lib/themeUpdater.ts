'use client';

import { useTheme } from '@/context/ThemeProvider';
import { useEffect } from 'react';

export const ThemeUpdater = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = theme; // Apply the current theme as a class
  }, [theme]);

  return null; // This component doesn't need to render anything
};
