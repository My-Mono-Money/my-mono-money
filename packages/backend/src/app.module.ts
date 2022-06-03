import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { authConfig } from './configs/auth.config';
import { sendinblueConfig } from './configs/sendinblue.config';
import { typeOrmConfig } from './configs/typeorm.config';
import { DocsModule } from './docs/docs.module';
import { ApiModule } from './layers/api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [typeOrmConfig, sendinblueConfig, authConfig],
      envFilePath: ['.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('typeorm');
      },
    }),
    ApiModule,
    DocsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
