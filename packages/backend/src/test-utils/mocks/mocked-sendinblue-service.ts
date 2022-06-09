import { createMock } from '@golevelup/ts-jest';
import { SendinblueService } from 'src/layers/integrations/sendinblue/sendinblue.service';

export const createMockedSendInBlueService = () =>
  createMock<SendinblueService>();
