import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXTAUTH_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${domain}/verify-email?token=${token}`;

  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    // Once we buy a domain name, we can send to any email. Until then please reach out to Alabudi for the verification link
    // to: email,
    to: 'mohamadalabudi42@gmail.com',
    subject: 'Please Verify Your Email',
    html: `<p>Click <a href="${confirmationLink}">here</a> to verify your email.</p>`,
  });

  if (error) {
    console.error(error);
  }
};
