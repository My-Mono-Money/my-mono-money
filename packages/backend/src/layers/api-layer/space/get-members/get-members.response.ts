import { ApiProperty } from '@nestjs/swagger';
import { SpaceMemberInvitation } from 'src/layers/storage/entities/space-member-invitation.entity';
import { StatusType } from 'src/layers/storage/interfaces/create-space-member-invitation-dto.interface';

export class GetSpaceMembersResponse {
  @ApiProperty({
    type: [SpaceMemberInvitation],
    isArray: true,
    example: [
      {
        id: '6e539ecf-e85e-44e5-bb90-eb25d8dadd5e',
        email: 'email@email.com',
        createdAt: '2023-05-03 08:00:07.231',
        updatedAt: '2023-05-03 08:00:07.231',
        status: StatusType.ACCEPTED,
      },
      {
        id: 'df5592a6-b54f-4090-b307-eae7797c0e43',
        email: 'email2@email.com',
        createdAt: '2023-05-03 08:00:07.231',
        updatedAt: '2023-05-03 08:00:07.231',
        status: StatusType.NEW,
      },
      {
        id: '82431e22-547b-4ab2-af3d-e37295d1f433',
        email: 'email3@email.com',
        createdAt: '2023-05-03 08:00:07.231',
        updatedAt: '2023-05-03 08:00:07.231',
        status: StatusType.REJECTED,
      },
    ],
  })
  items: SpaceMemberInvitation[];
}
