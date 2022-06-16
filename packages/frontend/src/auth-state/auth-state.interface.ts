export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface IAuthState {
  user?: IUser;
  token?: string;
  isAuthResolved: boolean;
}
