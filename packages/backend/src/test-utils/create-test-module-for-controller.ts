import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { FunctionalityModule } from 'src/layers/functionality/functionality.module';
import { SendinblueService } from 'src/layers/integrations/sendinblue/sendinblue.service';
import { config } from './config';
import { createMockedConnection } from './mocks/mocked-connection';
import { createMockedManager } from './mocks/mocked-manager';
import { createMockedSendInBlueService } from './mocks/mocked-sendinblue-service';

export const createTestModuleForController = async (
  controllers: ModuleMetadata['controllers'],
) => {
  const mockedSendInBlueService = createMockedSendInBlueService();
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
      .overrideProvider(SendinblueService)
      .useValue(mockedSendInBlueService)
      .useMocker((token) => {
        if (token === getConnectionToken()) {
          return mockedConnection;
        }
      })
      .compile(),
    mocks: {
      mockedSendInBlueService,
      mockedConnection,
      mockedManager,
    },
  };
};
