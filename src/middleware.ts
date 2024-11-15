// Without a defined matcher, this line applies next-auth to the entire project
export { default } from 'next-auth/middleware';

// Pages that the user cannot visit unless they login (protected pages)
export const config = {
  matcher: [
    '/capture',
    '/maps',
    '/settings',
    '/settings/edit-account',
    '/settings/edit-password',
  ],
};
