import withPwa from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true, // Enable SWC minification for improved performance
  compiler: {
    removeConsole: process.env.PUBLIC_NEXT_NODE_ENV === 'prod', // Remove console.log in production
  },
};

// Configuration object tells the next-pwa plugin
const pwaConfig = {
  dest: 'public', // Destination directory for the PWA files
  disable: process.env.PUBLIC_NEXT_NODE_ENV !== 'prod', // Disable PWA in development mode
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
};

// Export the combined configuration for Next.js with PWA support
export default withPwa(pwaConfig)(nextConfig);
