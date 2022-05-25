import { HttpStatus } from '@nestjs/common';
import { StorageError } from './storage.error';
import { DUPLICATED_ENTITY_ERROR } from './types';

export class DuplicatedEntityError extends StorageError {
  constructor() {
    super(DUPLICATED_ENTITY_ERROR, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
