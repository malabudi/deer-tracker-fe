import Link from 'next/link';
import './globals.css';
import ActiveButton from '@/components/Active-Button/ActiveButton';

export default function NotFound() {
  return (
    <>
      <div className="not-found-container">
        <h1>Oops!</h1>
        <h2>404 - Page Not Found</h2>
        <p>Sorry, the page you requested could not be found</p>
        <Link href="/" passHref>
          <ActiveButton text="Let's take you back" />
        </Link>
      </div>
    </>
  );
}
