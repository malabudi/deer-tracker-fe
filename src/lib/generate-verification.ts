'use server';

import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/token';

export const generateTokenAndEmail = async (email) => {
  // Generate verification token after all validation passes and send email
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(email, verificationToken.token);
  return verificationToken;
};
