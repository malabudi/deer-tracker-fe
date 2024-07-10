import Link from 'next/link';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: 'black',
};

export default function Maps() {
  return (
    <>
      <h1>Maps</h1>
      <Link href="/">Go Back</Link>
    </>
  );
}
