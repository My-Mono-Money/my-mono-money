import { Injectable } from '@nestjs/common';
import { Connection, Raw } from 'typeorm';
import { handleStorageError } from 'src/common/errors/utils/handle-storage-error';
import { ICreateUserDto } from '../interfaces/create-user-dto.interface';
import { User } from '../entities/user.entity';
import { IUpdateUserDto } from '../interfaces/update-user-dto.interface';
import { Space } from '../entities/space.entity';
import { ICreateSpaceDto } from '../interfaces/create-space-dto.interface';

interface ISaveUserOptions {
  afterSave?: () => Promise<void>;
}

@Injectable()
export class UserStorage {
  constructor(private connection: Connection) {}

  async save(
    user: ICreateUserDto,
    ownerSpace?: Space,
    { afterSave }: ISaveUserOptions = {},
  ) {
    try {
      return await this.connection.transaction(async (manager) => {
        const savedSpace = await manager.save(manager.create<Space>(Space, {}));
        const userEntity = manager.create<User>(User, user);
        userEntity.ownSpace = savedSpace;
        if (ownerSpace) {
          userEntity.defaultSpace = ownerSpace;
        } else {
          userEntity.defaultSpace = savedSpace;
        }

        const savedUser = await manager.save(userEntity);

        if (afterSave) {
          await afterSave();
        }

        return savedUser;
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

  async updateDefaultSpace(email: string, space: ICreateSpaceDto) {
    try {
      return await this.connection.transaction(async (manager) => {
        const where = { email };

        return manager.update<User>(User, where, { defaultSpace: space });
      });
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

  async geyByEmailHash(hash: string) {
    try {
      return await this.connection.manager.findOne(User, {
        where: {
          email: Raw(
            (alias) =>
              `encode(sha256(${
                alias.split('.')[1]
              }::bytea), 'hex') = '${hash}'`,
          ),
        },
      });
    } catch (e) {
      handleStorageError(e);
    }
  }

  async getSpaceByEmail(email: string) {
    try {
      return (await this.getByEmail(email)).ownSpace;
    } catch (e) {
      handleStorageError(e);
    }
  }

  async getUserBySpace(space: string) {
    try {
      return await this.connection.manager.findOne(User, {
        where: {
          ownSpace: space,
        },
      });
    } catch (e) {
      handleStorageError(e);
    }
  }

  async changeDefaultSpace(email: string, space: ICreateSpaceDto) {
    try {
      return await this.connection.transaction(async (manager) => {
        const where = { email };

        return manager.update<User>(User, where, { defaultSpace: space });
      });
    } catch (e) {
      handleStorageError(e);
    }
  }
}
