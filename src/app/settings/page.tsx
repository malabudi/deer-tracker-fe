'use client';

import BottomNav from '@/components/bottom-nav/BottomNav';
//import { signOut } from 'next-auth/react';

export default function Settings() {
  /*REMOVE LATER OR WHEN REBASING
  const handleSignOut = () => {
    signOut({
      callbackUrl: '/', // Optional: redirect to homepage after sign out
    });
  };*/

  return (
    <>
      <h1>Settings</h1>
      {/* REMOVE LATER OR WHEN REBASING
      <button onClick={handleSignOut}>Sign Out</button>*/}
      <BottomNav />
    </>
  );
}
