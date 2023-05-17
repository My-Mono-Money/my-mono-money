import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
import { TOKEN_EMPTY_ERROR } from './types';

export class TokenEmptyError extends AppError {
  constructor() {
    super(TOKEN_EMPTY_ERROR, HttpStatus.NOT_ACCEPTABLE);
  }
}
