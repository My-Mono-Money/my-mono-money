import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { handleStorageError } from 'src/common/errors/utils/handle-storage-error';
import { ICreateUserDto } from '../interfaces/create-user-dto.interface';
import { User } from '../entities/user.entity';

interface ISaveUserOptions {
  transactionCallback?: () => Promise<void>;
}

@Injectable()
export class UserService {
  constructor(private connection: Connection) {}

  async save(
    user: ICreateUserDto,
    { transactionCallback }: ISaveUserOptions = {},
  ) {
    try {
      return await this.connection.transaction(async (manager) => {
        const entity = manager.create<User>(User, user);
        const result = await manager.save(entity);

        if (transactionCallback) {
          await transactionCallback();
        }

        return result;
      });
    } catch (e) {
      handleStorageError(e);
    }
  }
}
