import { createMock } from '@golevelup/ts-jest';
import { SendinblueIntegration } from 'src/layers/integration/sendinblue/sendinblue.integration';

export const createMockedSendInBlueIntegration = () =>
  createMock<SendinblueIntegration>();
