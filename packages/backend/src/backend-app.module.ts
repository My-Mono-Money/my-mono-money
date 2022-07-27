import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './configs/app.config';
import { authConfig } from './configs/auth.config';
import { sendinblueConfig } from './configs/sendinblue.config';
import { typeOrmConfig } from './configs/typeorm.config';
import { DocsModule } from './docs/docs.module';
import { ApiLayerModule } from './layers/api-layer/api-layer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [typeOrmConfig, sendinblueConfig, authConfig, appConfig],
      envFilePath: ['.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('typeorm');
      },
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
        password: 'redis',
      },
    }),
    ApiLayerModule,
    DocsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class BackendAppModule {}
