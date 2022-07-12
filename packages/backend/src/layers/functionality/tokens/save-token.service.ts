import { Injectable } from '@nestjs/common';
import { MonobankService } from 'src/layers/integrations/monobank/monobank.service';
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
  ) {}

  async save({ token, email }: ISaveTokenData) {
    const { accounts } = await this.monobankService.getClientInfo({ token });
    const space = await this.userService.getSpaceByEmail(email);
    await this.tokenService.saveTokenWithAccounts({ token, space, accounts });
  }
}
