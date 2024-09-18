'use client';
import styles from './page.module.css';

import { logIn, signUp } from '@/utils/constants';
import ActiveButton from '@/components/Active-Button/ActiveButton';
import InactiveButton from '@/components/Inactive-Button/InactiveButton';

export default function Home() {
  return (
    <main className={styles.mainpageContainer}>
      <div className={styles.headerconatiner}>
        <h1 className={styles.welcomecontainer}>Welcome to Deer Tracker!</h1>
      </div>

      <div className={styles.lgnbttncontainer}>
        <ActiveButton
          text={logIn}
          onClick={() => console.log('ln Button clicked!')}
        />
      </div>
      <div className={styles.signbttncontainer}>
        <InactiveButton
          text={signUp}
          onClick={() => console.log('su Button clicked!')}
        />
      </div>
    </main>
  );
}
