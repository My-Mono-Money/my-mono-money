import { Module } from '@nestjs/common';
import { SignInController } from './authentication/sign-in.controller';

@Module({
  controllers: [SignInController],
})
export class ApiModule {}
