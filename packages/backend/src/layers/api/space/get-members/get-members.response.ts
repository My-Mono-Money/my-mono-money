import { ApiProperty } from '@nestjs/swagger';
import { StatusType } from 'src/layers/storage/interfaces/create-space-member-invitation-dto.interface';

class Owner {
  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

class SpaceMembersWithOwners {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  status: StatusType;

  @ApiProperty()
  owner: Owner;
}
export class GetSpaceMembersResponse {
  @ApiProperty({
    type: [SpaceMembersWithOwners],
    isArray: true,
    example: [
      {
        id: '6e539ecf-e85e-44e5-bb90-eb25d8dadd5e',
        email: 'email@email.com',
        createdAt: '2023-05-03 08:00:07.231',
        updatedAt: '2023-05-03 08:00:07.231',
        status: StatusType.ACCEPTED,
        owner: {
          email: 'owner1@email.com',
          firstName: 'Owner1',
          lastName: 'Own',
        },
      },
      {
        id: 'df5592a6-b54f-4090-b307-eae7797c0e43',
        email: 'email2@email.com',
        createdAt: '2023-05-03 08:00:07.231',
        updatedAt: '2023-05-03 08:00:07.231',
        status: StatusType.NEW,
        owner: {
          email: 'owner2@email.com',
          firstName: 'Owner2',
          lastName: 'Own',
        },
      },
      {
        id: '82431e22-547b-4ab2-af3d-e37295d1f433',
        email: 'email3@email.com',
        createdAt: '2023-05-03 08:00:07.231',
        updatedAt: '2023-05-03 08:00:07.231',
        status: StatusType.REJECTED,
        owner: {
          email: 'owner3@email.com',
          firstName: 'Owner3',
          lastName: 'Own',
        },
      },
    ],
  })
  items: SpaceMembersWithOwners[];
}
