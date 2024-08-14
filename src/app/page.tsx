import BottomNav from '@/components/bottom-nav/BottomNav';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Welcome to Deer Tracker!</h1>
      <h2>Powered by TensorFlow</h2>
      <BottomNav />
    </main>
  );
}
