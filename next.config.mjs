import withPwa from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true, // Enable SWC minification for improved performance
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'beta' || process.env.NODE_ENV === 'prod', // Remove console.log in production
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

// Configuration object tells the next-pwa plugin
const pwaConfig = {
  dest: 'public', // Destination directory for the PWA files
  disable: process.env.NODE_ENV !== 'beta' || process.env.NODE_ENV !== 'prod', // Disable PWA in development mode
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
};

// Export the combined configuration for Next.js with PWA support
export default withPwa(pwaConfig)(nextConfig);
