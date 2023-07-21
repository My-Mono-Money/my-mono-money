export enum FeatureName {
  bypassMonobankRateLimit = 'bypass_monobank_rate_limit',
  verifyMonobankIntegration = 'verify_monobank_integration',
}

export interface ICreateFeatureFlagDto {
  featureName: FeatureName;
  isEnabled: boolean;
}
