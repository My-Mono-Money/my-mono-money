import { registerAs } from '@nestjs/config';

interface IRedisOptions {
  host: string;
  port: string;
  password: string;
}

type CreateRedisConfig = () => IRedisOptions;

const createRedisConfig: CreateRedisConfig = () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

export const redisConfig = registerAs('redis', createRedisConfig);
