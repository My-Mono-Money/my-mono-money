import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { StatementStorage } from './services/statement.storage';
import { TokenStorage } from './services/token.storage';
import { UserStorage } from './services/user.storage';
import { SpaceStorage } from './services/space.storage';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserStorage, TokenStorage, StatementStorage, SpaceStorage],
  exports: [UserStorage, TokenStorage, StatementStorage, SpaceStorage],
})
export class StorageModule {}
