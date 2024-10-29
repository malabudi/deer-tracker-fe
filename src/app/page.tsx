'use client';
import styles from './page.module.css';
import { logIn, signUp } from '@/utils/constants';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import InactiveButton from '@/components/Inactive-Button/InactiveButton';
import Link from 'next/link';
import { useRedirectIfAuthed } from '@/hooks/useRedirect';

export default function Home() {
  useRedirectIfAuthed('/settings');

  return (
    <main className={styles.mainpageContainer}>
      <div className={styles.headerconatiner}>
        <h1 className={styles.welcomecontainer}>Welcome to Deer Tracker!</h1>
      </div>

      <div className={styles.btnContainer}>
        <Link href="/login" passHref>
          <ActiveButton text={logIn} />
        </Link>
        <Link href="/signup" passHref>
          <InactiveButton text={signUp} />
        </Link>
      </div>
    </main>
  );
}
