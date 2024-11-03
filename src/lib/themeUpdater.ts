'use client';

import { useTheme } from '@/context/ThemeProvider';
import { useEffect } from 'react';

export const ThemeUpdater = () => {
  const { theme } = useTheme();

  // For all components that have a light/dark variant, add them here
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return null; // This component doesn't need to render anything
};
