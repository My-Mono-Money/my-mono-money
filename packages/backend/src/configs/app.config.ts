import { registerAs } from '@nestjs/config';

interface IAppOptions {
  frontendUrl: string;
  monobankApiUrl: string;
  monobankRequestDelay: string;
}

type CreateAppConfig = () => IAppOptions;

const createAppConfig: CreateAppConfig = () => ({
  frontendUrl: process.env.FRONTEND_URL,
  backendAppDomain: process.env.BACKEND_APP_DOMAIN,
  monobankApiUrl: process.env.MONOBANK_API_URL,
  monobankRequestDelay: process.env.MONOBANK_REQUESTS_DELAY,
  supportEmail: process.env.SUPPORT_EMAIL,
  backendUrl: process.env.BACKEND_URL,
});

export const appConfig = registerAs('app', createAppConfig);
