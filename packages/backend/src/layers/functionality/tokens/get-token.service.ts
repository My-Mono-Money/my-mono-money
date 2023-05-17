import { Injectable } from '@nestjs/common';
import { TokenStorage } from 'src/layers/storage/services/token.storage';

@Injectable()
export class TokenService {
  constructor(private tokenStorage: TokenStorage) {}

  async getTokenList({ email }) {
    return await this.tokenStorage.getTokenList({ email });
  }
}
