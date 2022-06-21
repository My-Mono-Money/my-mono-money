import { Module } from '@nestjs/common';
import { ClientInfoController } from './client-info/client-info.controllers';
import { StatementController } from './statement/statement.controller';

@Module({
  controllers: [ClientInfoController, StatementController],
})
export class ApiModule {}
