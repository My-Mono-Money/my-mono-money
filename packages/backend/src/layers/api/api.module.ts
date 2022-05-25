import { Module } from '@nestjs/common';
import { FunctionalityModule } from '../functionality/functionality.module';
import { SignInController } from './authentication/sign-in/sign-in.controller';
import { SignUpController } from './authentication/sign-up/sign-up.controller';

@Module({
  imports: [FunctionalityModule],
  controllers: [SignInController, SignUpController],
})
export class ApiModule {}
