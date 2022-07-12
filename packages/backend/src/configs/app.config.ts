import { registerAs } from '@nestjs/config';

interface IAppOptions {
  frontendUrl: string;
  monobankApiUrl: string;
}

type CreateAppConfig = () => IAppOptions;

const createAppConfig: CreateAppConfig = () => ({
  frontendUrl: process.env.FRONTEND_URL,
  monobankApiUrl: process.env.MONOBANK_API_URL,
});

export const appConfig = registerAs('app', createAppConfig);
