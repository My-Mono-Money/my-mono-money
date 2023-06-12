export enum FeatureName {
  bypassMonobankRateLimit = 'bypass_monobank_rate_limit',
}

export interface ICreateFeatureFlagDto {
  featureName: FeatureName;
  isEnabled: boolean;
}
