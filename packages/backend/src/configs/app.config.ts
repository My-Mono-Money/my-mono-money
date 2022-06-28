import { registerAs } from '@nestjs/config';

interface IAppOptions {
  frontendUrl: string;
}

type CreateAppConfig = () => IAppOptions;

const createAppConfig: CreateAppConfig = () => ({
  frontendUrl: process.env.FRONTEND_URL,
});

export const appConfig = registerAs('app', createAppConfig);
