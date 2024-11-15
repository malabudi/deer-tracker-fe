'use client';
import styles from './page.module.css';
import { logIn, signUp } from '@/utils/constants';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import InactiveButton from '@/components/Inactive-Button/InactiveButton';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      router.push(`/settings`);
    }
  }, [session, status, router]);

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
