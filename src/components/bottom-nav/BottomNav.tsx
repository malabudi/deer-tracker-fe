'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useNavigation from '@/hooks/useNavigation';
//import useScroll from '@/hooks/useScroll';
import styles from './page.module.css';
import cameraIcon from '@/assets/Camera.svg';
import mapIcon from '@/assets/Map.svg';
import settingsIcon from '@/assets/Gear.svg';

const BottomNav = () => {
  //const scrollDirection = useScroll(); // Use the custom hook
  //const navClass = scrollDirection === 'up' ? '' : 'opacity-25 duration-500';

  const { isCameraActive, isMapsActive, isSettingsActive } = useNavigation();

  return (
    <div className={styles.navContainer}>
      <Link href="/capture">
        {isCameraActive ? (
          <Image
            priority
            src={cameraIcon}
            alt="Active camera icon"
            className={styles.activeIcon}
          />
        ) : (
          <Image
            priority
            src={cameraIcon}
            alt="Inactive camera icon"
            className={styles.inactiveIcon}
          />
        )}
      </Link>
      <Link href="/maps">
        {isMapsActive ? (
          <Image
            priority
            src={mapIcon}
            alt="Active map icon"
            className={styles.activeIcon}
          />
        ) : (
          <Image
            priority
            src={mapIcon}
            alt="Inactive map icon"
            className={styles.inactiveIcon}
          />
        )}
      </Link>
      <Link href="/settings">
        {isSettingsActive ? (
          <Image
            priority
            src={settingsIcon}
            alt="Active settings icon"
            className={styles.activeIcon}
          />
        ) : (
          <Image
            priority
            src={settingsIcon}
            alt="Inactive settings icon"
            className={styles.inactiveIcon}
          />
        )}
      </Link>
    </div>
  );
};

export default BottomNav;
