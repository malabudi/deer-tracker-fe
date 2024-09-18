'use client';
import styles from './page.module.css';
import ActiveButton from '@/components/button/ActiveButton';
import InactiveButton from '@/components/button/InactiveButton';

export default function Home() {
  return (
    <main className={styles.mainpageContainer}>
      <div className={styles.headerconatiner}>
        <h1 className={styles.welcomecontainer}>Welcome to Deer Tracker!</h1>
      </div>

      <div className={styles.lgnbttncontainer}>
        <ActiveButton
          text="Log in"
          onClick={() => console.log('ln Button clicked!')}
        />
      </div>
      <div className={styles.signbttncontainer}>
        <InactiveButton
          text="Sign up"
          onClick={() => console.log('su Button clicked!')}
        />
      </div>
      {/*<BottomNav />*/}
    </main>
  );
}
