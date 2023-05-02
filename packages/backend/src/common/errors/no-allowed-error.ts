import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
import { NOT_ALLOWED_ERROR } from './types';

export class NotAllowedError extends AppError {
  constructor() {
    super(NOT_ALLOWED_ERROR, HttpStatus.NOT_ACCEPTABLE);
  }
}
