import { Injectable } from '@nestjs/common';
import { AccessDeniedError } from '~/common/errors/access-denied-error';
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
  ) {}

  async delete({ tokenId, email }: IDeleteTokenArgs) {
    const currentUserSpace = await this.userStorage.getSpaceByEmail(email);
    const token = await this.tokenStorage.getTokenByTokenId(tokenId);
    const isOwnSpace = currentUserSpace.id === token.space.id;

    if (!isOwnSpace) {
      throw new AccessDeniedError();
    }

    return await this.tokenStorage.deleteToken(tokenId);
  }
}
