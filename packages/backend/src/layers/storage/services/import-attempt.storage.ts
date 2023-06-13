import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ICreateMonobankTokenImportAttemptDto } from '../interfaces/create-monobank-token-import-attempt-dto.interface';
import { MonobankTokenImportAttempt } from '../entities/monobank-token-import-attempt.entity';
import { handleStorageError } from '~/common/errors/utils/handle-storage-error';
import { IUpdateMonobankTokenImportAttemptDto } from '../interfaces/update-monobank-token-import-attempt-dto.interface';

@Injectable()
export class ImportAttemptStorage {
  constructor(private connection: Connection) {}

  async saveImportAttempt({
    fetchedMonths,
    totalMonths,
    log,
    status,
    token,
  }: ICreateMonobankTokenImportAttemptDto) {
    try {
      return await this.connection.transaction(async (manager) => {
        const monobankTokenImportAttemptEntity =
          manager.create<MonobankTokenImportAttempt>(
            MonobankTokenImportAttempt,
            {
              fetchedMonths,
              totalMonths,
              log,
              status,
              token,
            },
          );
        const saveMonobankTokenImportAttempt = await manager.save(
          monobankTokenImportAttemptEntity,
        );

        return saveMonobankTokenImportAttempt;
      });
    } catch (e) {
      handleStorageError(e);
    }
  }
  async updateImportAttempt(
    { status, log }: IUpdateMonobankTokenImportAttemptDto,
    importAttemptId: string,
  ) {
    try {
      const where = { id: importAttemptId };
      return await this.connection.transaction(async (manager) => {
        await manager.update<MonobankTokenImportAttempt>(
          MonobankTokenImportAttempt,
          where,
          { status, log },
        );

        const updatedImportAttempt = await manager.findOne(
          MonobankTokenImportAttempt,
          importAttemptId,
        );
        return updatedImportAttempt;
      });
    } catch (e) {
      handleStorageError(e);
    }
  }

  async getByImportAttemptId(id: string) {
    try {
      console.log('getByImportAttemptId', id);
      return await this.connection.manager.findOne(MonobankTokenImportAttempt, {
        where: { id },
      });
    } catch (e) {
      handleStorageError(e);
    }
  }
}
