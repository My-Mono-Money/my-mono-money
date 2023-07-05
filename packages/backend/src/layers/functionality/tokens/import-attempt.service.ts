import { Injectable } from '@nestjs/common';
import { AccessDeniedError } from '~/common/errors/access-denied-error';
import { ImportAttemptStorage } from '~/storage/services/import-attempt.storage';
import { SpaceStorage } from '~/storage/services/space.storage';
import { TokenStorage } from '~/storage/services/token.storage';
import { UserStorage } from '~/storage/services/user.storage';

interface IImportAttemptArgs {
  importAttemptId: string;
  tokenId: string;
  email: string;
}

@Injectable()
export class ImportAttemptService {
  constructor(
    private importAttemptStorage: ImportAttemptStorage,
    private userStorage: UserStorage,
    private tokenStorage: TokenStorage,
    private spaceStorage: SpaceStorage,
  ) {}

  async getImportAttempt({
    importAttemptId,
    tokenId,
    email,
  }: IImportAttemptArgs) {
    const currentUserSpace = await this.userStorage.getSpaceByEmail(email);
    const token = await this.tokenStorage.getTokenByTokenId(tokenId);
    const isOwnSpace = currentUserSpace.id === token.space.id;
    const isSharedSpace = Boolean(
      await this.spaceStorage.getAcceptedMemberInvite(email, token.space.id),
    );

    if (!isOwnSpace && !isSharedSpace) {
      throw new AccessDeniedError();
    }

    return await this.importAttemptStorage.getByImportAttemptId({
      id: importAttemptId,
      tokenId: tokenId,
    });
  }
}
