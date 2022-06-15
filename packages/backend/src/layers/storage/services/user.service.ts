import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { handleStorageError } from 'src/common/errors/utils/handle-storage-error';
import { ICreateUserDto } from '../interfaces/create-user-dto.interface';
import { User } from '../entities/user.entity';
import { IUpdateUserDto } from '../interfaces/update-user-dto.interface';

interface ISaveUserOptions {
  afterSave?: () => Promise<void>;
}

@Injectable()
export class UserService {
  constructor(private connection: Connection) {}

  async save(user: ICreateUserDto, { afterSave }: ISaveUserOptions = {}) {
    try {
      return await this.connection.transaction(async (manager) => {
        const entity = manager.create<User>(User, user);
        const result = await manager.save(entity);

        if (afterSave) {
          await afterSave();
        }

        return result;
      });
    } catch (e) {
      handleStorageError(e);
    }
  }

  async updateByEmail(email: string, user: IUpdateUserDto) {
    try {
      const where = { email };

      return await this.connection.manager.update(User, where, user);
    } catch (e) {
      handleStorageError(e);
    }
  }

  async getByEmail(email: string) {
    try {
      return await this.connection.manager.findOne(User, {
        where: {
          email,
        },
      });
    } catch (e) {
      handleStorageError(e);
    }
  }
}
