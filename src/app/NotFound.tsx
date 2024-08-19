import Link from 'next/link';
import BottomNav from '@/components/bottom-nav/BottomNav';
import './globals.css';

export default function NotFound() {
  return (
    <>
      <BottomNav />
      <div className="not-found-container">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry, the page you are looking for doesn't exist.</p>
        <Link href="/">Go back to Home</Link>
      </div>
    </>
  );
}
