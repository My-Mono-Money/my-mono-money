import { Injectable } from '@nestjs/common';
import { UserService } from 'src/layers/storage/services/user.service';

@Injectable()
export class GetUserService {
  constructor(private userService: UserService) {}

  async getUser(email: string) {
    return await this.userService.getByEmail(email);
  }
}
