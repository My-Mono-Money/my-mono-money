import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
import { INVALID_EMAIL_OR_PASSWORD_ERROR } from './types';

export class InvalidEmailOrPasswordError extends AppError {
  constructor() {
    super(INVALID_EMAIL_OR_PASSWORD_ERROR, HttpStatus.UNAUTHORIZED);
  }
}
