import { registerAs } from '@nestjs/config';

export const config = [
  registerAs('auth', () => ({
    secret: 'test secret',
  })),
];
