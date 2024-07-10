import Link from 'next/link';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: 'black',
};

export default function Settings() {
  return (
    <>
      <h1>Settings</h1>
      <Link href="/">Go Back</Link>
    </>
  );
}
