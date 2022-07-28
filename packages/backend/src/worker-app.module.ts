import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './configs/app.config';
import { authConfig } from './configs/auth.config';
import { redisConfig } from './configs/redis.config';
import { sendinblueConfig } from './configs/sendinblue.config';
import { typeOrmConfig } from './configs/typeorm.config';
import { WorkerLayerModule } from './layers/worker-layer/worker-layer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        typeOrmConfig,
        sendinblueConfig,
        authConfig,
        appConfig,
        redisConfig,
      ],
      envFilePath: ['.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('typeorm');
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: configService.get('redis'),
      }),
    }),
    WorkerLayerModule,
  ],
})
export class WorkerAppModule {}
