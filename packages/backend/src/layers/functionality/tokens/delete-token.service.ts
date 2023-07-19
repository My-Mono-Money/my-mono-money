import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AccessDeniedError } from '~/common/errors/access-denied-error';
import { ImportAttemptStatusType } from '~/storage/interfaces/create-monobank-token-import-attempt-dto.interface';
import { ImportAttemptStorage } from '~/storage/services/import-attempt.storage';
import { SpaceStorage } from '~/storage/services/space.storage';
import { TokenStorage } from '~/storage/services/token.storage';
import { UserStorage } from '~/storage/services/user.storage';

interface IDeleteTokenArgs {
  tokenId: string;
  email: string;
}

@Injectable()
export class DeleteTokenService {
  constructor(
    private userStorage: UserStorage,
    private tokenStorage: TokenStorage,
    private importAttemptStorage: ImportAttemptStorage,
  ) {}

  async delete({ tokenId, email }: IDeleteTokenArgs) {
    try {
      const currentUserSpace = await this.userStorage.getSpaceByEmail(email);
      const token = await this.tokenStorage.getTokenByTokenId(tokenId);
      const isOwnSpace = currentUserSpace.id === token.space.id;

      if (!isOwnSpace) {
        throw new AccessDeniedError();
      }

      const tryFindImportAttempt = await this.importAttemptStorage.getByTokenId(
        token.token,
      );

      const checkInProgressImport = tryFindImportAttempt.find(
        (item) => item.status === ImportAttemptStatusType.InProgress,
      );
      if (checkInProgressImport) {
        throw new Error('Statement import in progress');
      }

      return await this.tokenStorage.deleteToken(tokenId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
