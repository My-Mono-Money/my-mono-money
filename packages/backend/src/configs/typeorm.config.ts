import { registerAs } from '@nestjs/config';

export const createTypeOrmConfig = () => ({
  name: 'default',
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [`${__dirname}/../layers/storage/*.entity.{ts,js}`],
  migrations: [`${__dirname}/../database/migrations/*.{ts,js}`],
  synchronize: false,
  cli: {
    migrationsDir: `${__dirname}/../database/migrations`,
  },
});

export const typeOrmConfig = registerAs('typeorm', createTypeOrmConfig);
