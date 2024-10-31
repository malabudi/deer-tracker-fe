import { getUserByEmail, updateUserEmailVerified } from '@/hooks/apis/users';
import {
  deleteVerificationToken,
  getVerificationTokenByToken,
} from '@/hooks/apis/verificationToken';

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: 'Invalid token' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      error:
        'Your verification link has expired, but we can send the link again!',
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { errpr: 'User not found' };
  }

  // After these checks, the email is verified. The token can now be deleted
  await updateUserEmailVerified(existingToken.email, new Date());
  await deleteVerificationToken(existingToken.email);

  return { success: 'Email verified' };
};
