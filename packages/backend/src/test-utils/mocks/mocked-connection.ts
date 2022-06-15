import { createMock } from '@golevelup/ts-jest';
import { Connection, EntityManager } from 'typeorm';

type RunInTransactionCallback = (entityManager: EntityManager) => Promise<any>;

export const createMockedConnection = (mockedManager: EntityManager) => {
  const mockedConnection = createMock<Connection>();

  const mockedTransactionImplementation = async (
    runInTransaction: RunInTransactionCallback,
  ) => {
    return await runInTransaction(mockedManager);
  };

  mockedConnection.transaction.mockImplementation(
    mockedTransactionImplementation as any,
  );

  Object.assign(mockedConnection, {
    manager: mockedManager,
  });

  return mockedConnection;
};
