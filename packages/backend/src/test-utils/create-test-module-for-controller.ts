import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { FunctionalityModule } from 'src/layers/functionality/functionality.module';
import { SendinblueIntegration } from 'src/layers/integration/sendinblue/sendinblue.integration';
import { config } from './config';
import { createMockedConnection } from './mocks/mocked-connection';
import { createMockedManager } from './mocks/mocked-manager';
import { createMockedSendInBlueIntegration } from './mocks/mocked-sendinblue-service';
import { createMock } from '@golevelup/ts-jest';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';

export const createTestModuleForController = async (
  controllers: ModuleMetadata['controllers'],
) => {
  const mockedSendInBlueIntegration = createMockedSendInBlueIntegration();
  const mockedManager = createMockedManager();
  const mockedConnection = createMockedConnection(mockedManager);

  return {
    module: await Test.createTestingModule({
      imports: [
        FunctionalityModule,
        ConfigModule.forRoot({
          load: config,
        }),
      ],
      controllers,
    })
      .overrideProvider(getQueueToken('email'))
      .useValue(createMock<Queue>())
      .overrideProvider(getQueueToken('statement'))
      .useValue(createMock<Queue>())
      .overrideProvider(getQueueToken('webhook'))
      .useValue(createMock<Queue>())
      .overrideProvider(SendinblueIntegration)
      .useValue(mockedSendInBlueIntegration)
      .useMocker((token) => {
        if (token === getConnectionToken()) {
          return mockedConnection;
        }
      })
      .compile(),
    mocks: {
      mockedSendInBlueIntegration,
      mockedConnection,
      mockedManager,
    },
  };
};
