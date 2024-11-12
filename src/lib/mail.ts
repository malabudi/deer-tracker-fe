'use server';

import { SESEmailFormat } from '@/interfaces/EmailFormat';
import sesClient from '@/utils/sesClient';
import { SendEmailCommand } from '@aws-sdk/client-ses';

export const sendVerificationEmail = async (
  emailAddress: string,
  token: string
) => {
  const domain = process.env.NEXTAUTH_URL;
  const confirmationLink = `${domain}/verify-email?token=${token}`;

  const email: SESEmailFormat = {
    Source: 'cloud@wildsightai.com',
    Destination: {
      ToAddresses: [emailAddress],
    },
    Message: {
      Subject: { Data: 'Wild Sight AI - Verify Your Account' },
      Body: {
        Html: {
          Data: `
          <p>Click <a href="${confirmationLink}">here</a> to verify your email.</p>
          <p>The link will expire in one hour.</p>
          `,
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(email);
    const response = await sesClient.send(command);
    return response;
  } catch (error) {
    console.error('Error Sending Email: ', error);
    throw error;
  }
};
