export interface ICreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  isEmailVerified: boolean;
}
