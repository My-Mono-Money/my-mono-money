import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICreateAccountDto } from 'src/layers/storage/interfaces/create-account-dto.interface';

interface IGetClientInfo {
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
}
