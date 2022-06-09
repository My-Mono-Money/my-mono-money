import { QueryFailedError } from 'typeorm';

export const databaseErrors = {
  keyAlreadyExists: (key: string) =>
    new QueryFailedError('mocked-query', [], {
      detail: `Key "${key}" already exists.`,
    }),
};
