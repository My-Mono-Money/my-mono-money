import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
import { NOT_FOUND_ERROR } from './types';

export class NotFoundError extends AppError {
  constructor() {
    super(NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
  }
}
