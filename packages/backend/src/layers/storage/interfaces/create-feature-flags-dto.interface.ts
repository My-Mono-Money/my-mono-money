export enum FeatureName {
  bypass_monobank_rate_limit = 'bypass_monobank_rate_limit',
}

export interface ICreateFeatureFlagDto {
  featureName: FeatureName;
  isEnabled: boolean;
}
