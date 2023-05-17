import { Injectable } from '@nestjs/common';
import { MonobankIntegration } from 'src/layers/integration/monobank/monobank.integration';
import { QueueIntegration } from 'src/layers/integration/queue/queue.integration';
import { StatusType } from 'src/layers/storage/interfaces/create-space-member-invitation-dto.interface';
import { SpaceStorage } from 'src/layers/storage/services/space.storage';
import { TokenStorage } from 'src/layers/storage/services/token.storage';
import { UserStorage } from 'src/layers/storage/services/user.storage';

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
  ) {}

  async save({ token, email }: ISaveTokenData) {
    const { accounts } = await this.monobankIntegration.getClientInfo({
      token,
    });
    const space = await this.userStorage.getSpaceByEmail(email);
    const savedToken = await this.tokenStorage.saveTokenWithAccounts({
      token,
      space,
      accounts,
    });
    await this.monobankIntegration.setWebHook({ token, email });
    await this.queueIntegration.addToQueueStatement({ tokenId: savedToken.id });
    await this.spaceStorage.saveInvitation({
      email,
      space,
      status: StatusType.ACCEPTED,
    });
  }
}
