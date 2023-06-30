import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ICreateMonobankTokenImportAttemptDto } from '../interfaces/create-monobank-token-import-attempt-dto.interface';
import { MonobankTokenImportAttempt } from '../entities/monobank-token-import-attempt.entity';
import { handleStorageError } from '~/common/errors/utils/handle-storage-error';
import { IUpdateMonobankTokenImportAttemptDto } from '../interfaces/update-monobank-token-import-attempt-dto.interface';

interface GetByImportAttemptIdArgs {
  id: string;
  tokenId?: string;
}

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
      const manager = this.connection.manager;
      const monobankTokenImportAttemptEntity =
        manager.create<MonobankTokenImportAttempt>(MonobankTokenImportAttempt, {
          fetchedMonths,
          totalMonths,
          log,
          status,
          token,
        });
      const saveMonobankTokenImportAttempt = await manager.save(
        monobankTokenImportAttemptEntity,
      );

      return saveMonobankTokenImportAttempt;
    } catch (e) {
      handleStorageError(e);
    }
  }

  async updateImportAttempt(
    { status, log }: IUpdateMonobankTokenImportAttemptDto,
    importAttemptId: string,
  ) {
    try {
      const manager = this.connection.manager;
      const where = { id: importAttemptId };
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
    } catch (e) {
      handleStorageError(e);
    }
  }

  async updateFetchedMonthsCount(
    fetchedMonths: number,
    importAttemptId: string,
  ) {
    try {
      const manager = this.connection.manager;
      const where = {
        id: importAttemptId,
      } as Partial<MonobankTokenImportAttempt>;
      const importAttempt = await manager.findOne(
        MonobankTokenImportAttempt,
        where,
      );
      const updatedFetchedMonths = importAttempt.fetchedMonths + fetchedMonths;

      return await manager.update<MonobankTokenImportAttempt>(
        MonobankTokenImportAttempt,
        where,
        { fetchedMonths: updatedFetchedMonths },
      );
    } catch (e) {
      handleStorageError(e);
    }
  }

  async updateTotalMonthsCount(totalMonths: number, importAttemptId: string) {
    try {
      const manager = this.connection.manager;
      const where = {
        id: importAttemptId,
      } as Partial<MonobankTokenImportAttempt>;
      return await manager.update<MonobankTokenImportAttempt>(
        MonobankTokenImportAttempt,
        where,
        { totalMonths: totalMonths },
      );
    } catch (e) {
      handleStorageError(e);
    }
  }

  async removeFetchedMonthsCount(importAttemptId: string) {
    try {
      const manager = this.connection.manager;
      const where = {
        id: importAttemptId,
      } as Partial<MonobankTokenImportAttempt>;
      return await manager.update<MonobankTokenImportAttempt>(
        MonobankTokenImportAttempt,
        where,
        { fetchedMonths: 0 },
      );
    } catch (e) {
      handleStorageError(e);
    }
  }

  async removeTotalMonthsCount(importAttemptId: string) {
    try {
      const manager = this.connection.manager;
      const where = {
        id: importAttemptId,
      } as Partial<MonobankTokenImportAttempt>;
      return await manager.update<MonobankTokenImportAttempt>(
        MonobankTokenImportAttempt,
        where,
        { totalMonths: 0 },
      );
    } catch (e) {
      handleStorageError(e);
    }
  }

  async getByImportAttemptId({ id, tokenId }: GetByImportAttemptIdArgs) {
    try {
      return await this.connection.manager.findOne(MonobankTokenImportAttempt, {
        where: { id, token: { id: tokenId } },
      });
    } catch (e) {
      handleStorageError(e);
    }
  }

  async getByTokenId(tokenId: string) {
    try {
      const manager = this.connection.manager;
      const result = await manager.find(MonobankTokenImportAttempt, {
        relations: ['token'],
        where: { token: { token: tokenId } },
      });
      return result;
    } catch (e) {
      handleStorageError(e);
    }
  }
}
