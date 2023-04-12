export interface IVerifyEmailTokenPayload {
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified?: boolean;
}
