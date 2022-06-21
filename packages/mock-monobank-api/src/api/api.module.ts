import { Module } from '@nestjs/common';
import { ClientInfoController } from './client-info/client-info.controllers';

@Module({
  controllers: [ClientInfoController],
})
export class ApiModule {}
