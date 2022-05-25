import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { SignUpService } from './authentication/sign-up.service';

@Module({
  imports: [StorageModule],
  providers: [SignUpService],
  exports: [SignUpService],
})
export class FunctionalityModule {}
