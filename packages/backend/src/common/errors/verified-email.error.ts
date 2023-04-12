import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
import { VERIFIED_EMAIL_ERROR } from './types';

export class UnverifiedEmailError extends AppError {
  constructor() {
    super(VERIFIED_EMAIL_ERROR, HttpStatus.FORBIDDEN);
  }
}
