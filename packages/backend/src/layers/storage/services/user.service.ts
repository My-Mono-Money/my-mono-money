import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { handleStorageError } from 'src/common/errors/utils/handle-storage-error';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ICreateUserDto } from '../interfaces/create-user-dto.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async save(user: ICreateUserDto) {
    try {
      return await this.repository.save(user);
    } catch (e) {
      handleStorageError(e);
    }
  }
}
