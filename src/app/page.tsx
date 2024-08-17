'use client';
import styles from './page.module.css';
import Link from 'next/link';
import CreateSightingButton from '@/components/DeerSighting/deersighting';

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <h1>Capture</h1>
        <Link href="capture">Capture My Drive</Link>
      </div>

      <div>
        <h1>Maps</h1>
        <Link href="maps">Maps</Link>
      </div>

      <div>
        <h1>Settings</h1>
        <Link href="settings">Settings</Link>
      </div>
      <div>
        <h1>button to test sending deer location to flask</h1>
        <CreateSightingButton />
      </div>
    </main>
  );
}
