import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { handleStorageError } from '~/common/errors/utils/handle-storage-error';
import { FeatureFlag } from '../entities/feature-flags.entity';

@Injectable()
export class FeatureFlagStorage {
  constructor(private connection: Connection) {}
  async getFeatureFlag(featureName: string) {
    try {
      return await this.connection.manager.findOne(FeatureFlag, {
        where: {
          featureName,
        },
      });
    } catch (e) {
      handleStorageError(e);
    }
  }
}
