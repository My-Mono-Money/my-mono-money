import { Request } from 'express';
import { IVerifyEmailTokenPayload } from 'src/layers/functionality/authentication/interfaces/verify-email-token-payload.interface';

export interface IRequestWithUser extends Request {
  user: IVerifyEmailTokenPayload;
}
