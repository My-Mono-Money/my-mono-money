import { Injectable } from '@nestjs/common';
import { MonobankService } from 'src/layers/integrations/monobank/monobank.service';
import { QueueService } from 'src/layers/integrations/queue/queue.service';
import { StatusType } from 'src/layers/storage/interfaces/create-space-member-invitation-dto.interface';
import { SpaceService } from 'src/layers/storage/services/space.service';
import { TokenService } from 'src/layers/storage/services/token.service';
import { UserService } from 'src/layers/storage/services/user.service';

interface ISaveTokenData {
  token: string;
  email: string;
}

@Injectable()
export class SaveTokenService {
  constructor(
    private monobankService: MonobankService,
    private userService: UserService,
    private tokenService: TokenService,
    private queueService: QueueService,
    private spaceService: SpaceService,
  ) {}

  async save({ token, email }: ISaveTokenData) {
    const { accounts } = await this.monobankService.getClientInfo({ token });
    const space = await this.userService.getSpaceByEmail(email);
    const savedToken = await this.tokenService.saveTokenWithAccounts({
      token,
      space,
      accounts,
    });
    await this.monobankService.setWebHook({ token, email });
    await this.queueService.addToQueueStatement({ tokenId: savedToken.id });
    await this.spaceService.saveInvitation({
      email,
      space,
      status: StatusType.ACCEPTED,
    });
  }
}
