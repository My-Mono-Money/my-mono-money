export enum BypassMonobankRateLimit {
  bypass_monobank_rate_limit = 'bypass_monobank_rate_limit',
}

export interface ICreateFeatureFlagDto {
  featureName: BypassMonobankRateLimit;
  isEnabled: boolean;
}
