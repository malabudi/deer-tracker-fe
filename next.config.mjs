import withPwa from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true, // Enable SWC minification for improved performance
  compiler: {
    removeConsole: false, // Remove console.log in production
  },
  env: {
    PUBLIC_NEXT_NODE_ENV: process.env.PUBLIC_NEXT_NODE_ENV,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.enc.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
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
  disable: true, // Disable PWA in development mode
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
};

// Export the combined configuration for Next.js with PWA support
export default withPwa(pwaConfig)(nextConfig);
