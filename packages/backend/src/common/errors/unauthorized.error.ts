import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
import { UNAUTHORIZED_ERROR } from './types';

export class UnauthorizedError extends AppError {
  constructor() {
    super(UNAUTHORIZED_ERROR, HttpStatus.UNAUTHORIZED);
  }
}
