'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

const useNavigation = () => {
  const pathname = usePathname();
  const [isHomeActive, setIsHomeActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMapsActive, setIsMapsActive] = useState(false);
  const [isSettingsActive, setIsSettingsActive] = useState(false);

  useEffect(() => {
    setIsHomeActive(false);
    setIsCameraActive(false);
    setIsMapsActive(false);
    setIsSettingsActive(false);

    switch (pathname) {
      case '/':
        setIsHomeActive(true);
        break;
      case '/capture':
        setIsCameraActive(true);
        break;
      case '/maps':
        setIsMapsActive(true);
        break;
      case '/settings':
        setIsSettingsActive(true);
        break;
      default:
        // Handle any other cases here
        break;
    }
  }, [pathname]);

  return {
    isHomeActive,
    isCameraActive,
    isMapsActive,
    isSettingsActive,
  };
};

export default useNavigation;
