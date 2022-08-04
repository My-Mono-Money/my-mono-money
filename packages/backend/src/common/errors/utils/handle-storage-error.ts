import { Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { DuplicatedEntityError } from '../duplicated-entity.error';
import { UnknownError } from '../unknown.error';

const DUPLICATED_ERROR_MESSAGE_REGEX = /Key .* already exists\./;

const isDuplicatedEntityError = (error: Error | QueryFailedError) => {
  return (
    error instanceof QueryFailedError &&
    DUPLICATED_ERROR_MESSAGE_REGEX.test(error.driverError.detail)
  );
};

export const handleStorageError = (error: Error | QueryFailedError) => {
  Logger.error(error);
  if (isDuplicatedEntityError(error)) {
    throw new DuplicatedEntityError();
  }

  throw new UnknownError();
};
