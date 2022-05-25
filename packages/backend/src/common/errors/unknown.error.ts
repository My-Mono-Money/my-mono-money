import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
import { UNKNOWN_ERROR } from './types';

export class UnknownError extends AppError {
  constructor() {
    super(UNKNOWN_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
