export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
}

export interface IAuthState {
  user?: IUser;
  token?: string;
  isAuthResolved: boolean;
}
