import BottomNav from '@/components/bottom-nav/BottomNav';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Welcome to Deer Tracker!</h1>
      <h3>Powered by AI & Machine Learning</h3>
      <BottomNav />
    </main>
  );
}
