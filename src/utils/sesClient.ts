import { SESClient } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default sesClient;
