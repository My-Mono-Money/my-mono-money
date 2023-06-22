import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { ICreateAccountDto } from 'src/layers/storage/interfaces/create-account-dto.interface';
import {
  ICreateTransactionDto,
  ITransactionErrorDto,
} from 'src/layers/storage/interfaces/create-transaction-dto.interface';

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
  name: string;
}

@Injectable()
export class MonobankIntegration {
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
    try {
      const response = await this.httpService
        .get<ICreateTransactionDto[] | ITransactionErrorDto>(
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
    } catch (error) {
      const err = error.response;
      const data = {
        status: err.status,
        statusText: err.statusText,
        data: err.data.errorDescription,
      };
      return data;
    }
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
