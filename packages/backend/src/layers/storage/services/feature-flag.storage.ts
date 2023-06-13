import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { handleStorageError } from '~/common/errors/utils/handle-storage-error';
import { FeatureFlag } from '../entities/feature-flags.entity';
import { FeatureName } from '../interfaces/create-feature-flags-dto.interface';

@Injectable()
export class FeatureFlagStorage {
  constructor(private connection: Connection) {}
  async getFeatureFlags(): Promise<Record<FeatureName, boolean>> {
    try {
      const features = await this.connection.manager.find(FeatureFlag);
      return features.reduce((result, feature) => {
        result[feature.featureName] = feature.isEnabled;
        return result;
      }, {} as Record<FeatureName, boolean>);
    } catch (e) {
      handleStorageError(e);
    }
  }
}
