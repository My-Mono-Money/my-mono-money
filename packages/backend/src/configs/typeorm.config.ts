import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

type CreateTypeOrmConfig = () => TypeOrmModuleOptions;

export const createTypeOrmConfig: CreateTypeOrmConfig = () => ({
  name: 'default',
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [`${__dirname}/../layers/storage/entities/*.entity.{ts,js}`],
  migrations: [`${__dirname}/../database/migrations/*.{ts,js}`],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  cli: {
    migrationsDir: `${__dirname}/../database/migrations`,
  },
});

export const typeOrmConfig = registerAs('typeorm', createTypeOrmConfig);
