import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

interface IHashPasswordArgument {
  password: string;
}

interface IComparePasswordArgument extends IHashPasswordArgument {
  hash: string;
}

@Injectable()
export class HashPasswordService {
  async hashPassword({ password }: IHashPasswordArgument) {
    const saltOrRounds = 10;
    const passwordToHash = password;

    return await bcrypt.hash(passwordToHash, saltOrRounds);
  }

  async comparePassword({ password, hash }: IComparePasswordArgument) {
    return await bcrypt.compare(password, hash);
  }
}
