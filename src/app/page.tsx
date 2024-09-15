import BottomNav from '@/components/bottom-nav/BottomNav';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.mainpageContainer}>
      <div className={styles.headerconatiner}>
        <header className={styles.h1}>Welcome to Deer Tracker!</header>
      </div>
      <div className={styles.lgnbttncontainer}>
        <button className={styles.loginbtton}>login</button>
      </div>
      <div className={styles.signbttncontainer}>
        <button className={styles.signupbtton}>sign up</button>
      </div>
      <BottomNav />
    </main>
  );
}
