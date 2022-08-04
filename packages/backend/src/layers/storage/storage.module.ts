import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { StatementService } from './services/statement.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, TokenService, StatementService],
  exports: [UserService, TokenService, StatementService],
})
export class StorageModule {}
