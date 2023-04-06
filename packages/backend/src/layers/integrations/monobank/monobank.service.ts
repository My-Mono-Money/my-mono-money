import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { ICreateAccountDto } from 'src/layers/storage/interfaces/create-account-dto.interface';
import { ICreateTransactionDto } from 'src/layers/storage/interfaces/create-transaction-dto.interface';

interface IGetClientInfo {
  token: string;
}

interface IGetStatement {
  accountId: string;
  from: string;
  to: string;
  token: string;
}

interface IMonobankClientInfoResponse {
  accounts: ICreateAccountDto[];
}

@Injectable()
export class MonobankService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getClientInfo({ token }: IGetClientInfo) {
    const response = await this.httpService
      .get<IMonobankClientInfoResponse>(
        `${this.configService.get('app.monobankApiUrl')}/personal/client-info`,
        {
          headers: {
            'X-Token': token,
          },
        },
      )
      .toPromise();

    return response.data;
  }

  async getStatement({ token, accountId, from, to }: IGetStatement) {
    const response = await this.httpService
      .get<ICreateTransactionDto[]>(
        `${this.configService.get(
          'app.monobankApiUrl',
        )}/personal/statement/${accountId}/${from}/${to}`,
        {
          headers: {
            'X-Token': token,
          },
        },
      )
      .toPromise();

    return response;
  }

  async setWebHook({ token, email }) {
    const hash = (email: string) =>
      createHash('sha256').update(email).digest('hex');
    try {
      const response = await this.httpService
        .post(
          `${this.configService.get('app.monobankApiUrl')}/personal/webhook`,
          {
            webhookUrl: `${this.configService.get(
              'app.backendAppDomain',
            )}/v1/integration/monobankWebHook/${hash(email)}`,
          },
          {
            headers: {
              'X-Token': token,
            },
          },
        )
        .toPromise();

      return response;
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }
}
