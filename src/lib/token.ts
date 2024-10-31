import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationTokenByEmail,
} from '@/hooks/apis/verificationToken';
import { v4 as uuidv4 } from 'uuid';

export const generateVerificationToken = async (email: string) => {
  console.log(email);
  // Generate token
  const token = uuidv4();
  const hoursToExpire = 1;
  const expires = new Date().getTime() + 1000 * 60 * 60 * hoursToExpire; // expires in "hoursToExpire" amount of hours

  // Check if a token already exists, regenerate if it does exist
  try {
    const exisitingToken = await getVerificationTokenByEmail(email);

    if (exisitingToken) {
      console.log('Token found, regenerating a new one.');
      await deleteVerificationToken(email);
    }
  } catch {
    console.log('No token found, generating a new one.');
  }

  const verificationToken = await createVerificationToken({
    email: email,
    token: token,
    expires: new Date(expires),
  });

  return verificationToken;
};
