import { registerAs } from '@nestjs/config';

interface IAppOptions {
  frontendUrl: string;
  monobankApiUrl: string;
  monobankRequestDelay: string;
}

type CreateAppConfig = () => IAppOptions;

const createAppConfig: CreateAppConfig = () => ({
  frontendUrl: process.env.FRONTEND_URL,
  monobankApiUrl: process.env.MONOBANK_API_URL,
  monobankRequestDelay: process.env.MONOBANK_REQUESTS_DELAY,
});

export const appConfig = registerAs('app', createAppConfig);
