'use client';

import React from 'react';
import Link from 'next/link';
import useNavigation from '@/hooks/useNavigation';
import useScroll from '@/hooks/useScroll';

const Nav = () => {
  const scrollDirection = useScroll(); // Use the custom hook
  const navClass = scrollDirection === 'up' ? '' : 'opacity-25 duration-500';

  const { isCameraActive, isMapsActive, isSettingsActive } = useNavigation();

  return (
    <div>
      <div>
        <Link href="/capture">
          {isCameraActive ? <p>one - active</p> : <p>one</p>}
        </Link>
        <Link href="/maps">
          {isMapsActive ? <p>Two - active</p> : <p>Two</p>}
        </Link>
        <Link href="/settings">
          {isSettingsActive ? <p>othree - active</p> : <p>three</p>}
        </Link>
      </div>
    </div>
  );
};

export default Nav;
