export interface ISpaceMembers {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    email: string;
    firstName: string;
    lastName: string;
  };
}
