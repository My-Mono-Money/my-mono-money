import { Injectable } from '@nestjs/common';
import { MonobankIntegration } from 'src/layers/integration/monobank/monobank.integration';
import { QueueIntegration } from 'src/layers/integration/queue/queue.integration';
import { SpaceStorage } from 'src/layers/storage/services/space.storage';
import { TokenStorage } from 'src/layers/storage/services/token.storage';
import { UserStorage } from 'src/layers/storage/services/user.storage';
import { dateNowForLogs } from '~/common/date-format/date-now';
import {
  ImportAttemptLogDescription,
  ImportAttemptStatusType,
} from '~/storage/interfaces/create-monobank-token-import-attempt-dto.interface';
import { StatusType } from '~/storage/interfaces/create-space-member-invitation-dto.interface';
import { ImportAttemptStorage } from '~/storage/services/import-attempt.storage';

interface ISaveTokenData {
  token: string;
  email: string;
}

@Injectable()
export class SaveTokenService {
  constructor(
    private monobankIntegration: MonobankIntegration,
    private userStorage: UserStorage,
    private tokenStorage: TokenStorage,
    private queueIntegration: QueueIntegration,
    private spaceStorage: SpaceStorage,
    private monobankTokenImportAttempt: ImportAttemptStorage,
  ) {}

  async save({ token, email }: ISaveTokenData) {
    const { accounts, name } = await this.monobankIntegration.getClientInfo({
      token,
    });

    const space = await this.userStorage.getSpaceByEmail(email);
    const savedToken = await this.tokenStorage.saveTokenWithAccounts({
      token,
      space,
      accounts,
      name,
    });

    const savedImportAttempt =
      await this.monobankTokenImportAttempt.saveImportAttempt({
        fetchedMonths: 0,
        totalMonths: 0,
        log:
          dateNowForLogs() +
          ImportAttemptLogDescription.StatementImportIsQueued +
          '\n',
        status: ImportAttemptStatusType.NotStarted,
        token: savedToken,
      });
    await this.monobankIntegration.setWebHook({ token, email });
    await this.spaceStorage.saveInvitation({
      email,
      space,
      status: StatusType.ACCEPTED,
    });
    await this.queueIntegration.addToQueueStatement({
      tokenId: savedToken.id,
      importAttemptId: savedImportAttempt.id,
    });
  }
}
