import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { StatementStorage } from './services/statement.storage';
import { TokenStorage } from './services/token.storage';
import { UserStorage } from './services/user.storage';
import { SpaceStorage } from './services/space.storage';
import { ImportAttemptStorage } from './services/import-attempt.storage';
import { FeatureFlagStorage } from './services/feature-flag.storage';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserStorage,
    TokenStorage,
    StatementStorage,
    SpaceStorage,
    ImportAttemptStorage,
    FeatureFlagStorage,
  ],
  exports: [
    UserStorage,
    TokenStorage,
    StatementStorage,
    SpaceStorage,
    ImportAttemptStorage,
    FeatureFlagStorage,
  ],
})
export class StorageModule {}
