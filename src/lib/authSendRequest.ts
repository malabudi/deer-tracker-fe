export async function sendVerificationRequest({ identifier: email, url }) {
  // Call the cloud Email provider API for sending emails
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    // The body format will vary depending on provider, please see their documentation
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: 'noreply@company.com' },
      subject: 'Sign in to Your page',
      content: [
        {
          type: 'text/plain',
          value: `Please click here to authenticate - ${url}`,
        },
      ],
    }),
    headers: {
      // Authentication will also vary from provider to provider, please see their docs.
      Authorization: `Bearer ${process.env.SENDGRID_API}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    const { errors } = await response.json();
    throw new Error(JSON.stringify(errors));
  }
}
