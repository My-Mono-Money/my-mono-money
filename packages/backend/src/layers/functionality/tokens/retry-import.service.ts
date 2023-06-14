import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { format } from 'date-fns';
import { QueueIntegration } from '~/integration/queue/queue.integration';
import {
  ImportAttemptLogDescription,
  ImportAttemptStatusType,
} from '~/storage/interfaces/create-monobank-token-import-attempt-dto.interface';
import { ImportAttemptStorage } from '~/storage/services/import-attempt.storage';
import { TokenStorage } from '~/storage/services/token.storage';

@Injectable()
export class RetryImportService {
  constructor(
    private importAttemptStorage: ImportAttemptStorage,
    private queueIntegration: QueueIntegration,
    private monobankTokenImportAttempt: ImportAttemptStorage,
    private tokenStorage: TokenStorage,
  ) {}

  async startImport(tokenId: string, spaceOwnerEmail: string) {
    try {
      const tryFindImportAttempt = await this.importAttemptStorage.getByTokenId(
        tokenId,
      );
      const checkAlreadyImport = tryFindImportAttempt.find(
        (item) => item.status === ImportAttemptStatusType.Successful,
      );
      const checkInProgressImport = tryFindImportAttempt.find(
        (item) => item.status === ImportAttemptStatusType.InProgress,
      );
      const token = await this.tokenStorage.getTokenByTokenId(tokenId);
      if (!token) throw new Error('Token not found');

      if (checkAlreadyImport)
        throw new Error('Statement has already been imported');

      if (checkInProgressImport)
        throw new Error('Statement import in progress');

      const checkFailedImport = tryFindImportAttempt.find(
        (item) => item.status === ImportAttemptStatusType.Failed,
      );
      if (!checkFailedImport)
        throw new Error('Previous statement import must be failed');

      const newSavedImportAttempt =
        await this.monobankTokenImportAttempt.saveImportAttempt({
          fetchedMonths: 0,
          totalMonths: 0,
          log:
            ' - ' +
            format(new Date(), 'dd MMM yyyy HH:mm:ss ') +
            ' - ' +
            ImportAttemptLogDescription.StatementImportIsQueued +
            '\n',
          status: ImportAttemptStatusType.NotStarted,
          token: token,
        });
      await this.queueIntegration.addToQueueStatement({
        tokenId: token.id,
        importAttemptId: newSavedImportAttempt.id,
        spaceOwnerEmail,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
