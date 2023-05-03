import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
import { ACCESS_DENIED_ERROR } from './types';

export class AccessDeniedError extends AppError {
  constructor() {
    super(ACCESS_DENIED_ERROR, HttpStatus.FORBIDDEN);
  }
}
