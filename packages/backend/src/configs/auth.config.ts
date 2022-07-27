import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

type CreateAuthConfig = () => JwtModuleOptions;

export const createAuthConfig: CreateAuthConfig = () => ({
  secret: process.env.JWT_SECRET,
  debugToken: process.env.DEBUG_TOKEN,
});

export const authConfig = registerAs('auth', createAuthConfig);
