import { registerAs } from '@nestjs/config';

interface ISendinblueOptions {
  apiKey: string;
  senderName: string;
  senderEmail: string;
}

type CreateSendInBlueConfig = () => ISendinblueOptions;

const createSendInBlueConfig: CreateSendInBlueConfig = () => ({
  apiKey: process.env.SENDINBLUE_API_KEY,
  senderName: process.env.SENDINBLUE_SENDER_NAME,
  senderEmail: process.env.SENDINBLUE_SENDER_EMAIL,
});

export const sendinblueConfig = registerAs(
  'sendinblue',
  createSendInBlueConfig,
);
