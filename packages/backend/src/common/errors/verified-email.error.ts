import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
import { UNVERIFIED_EMAIL_ERROR } from './types';

export class UnverifiedEmailError extends AppError {
  constructor() {
    super(UNVERIFIED_EMAIL_ERROR, HttpStatus.FORBIDDEN);
  }
}
