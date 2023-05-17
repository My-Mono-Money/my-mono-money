import { ApiProperty } from '@nestjs/swagger';

class SpacesItem {
  @ApiProperty()
  spaceOwnerEmail: string;

  @ApiProperty()
  spaceOwnerName: string;

  @ApiProperty()
  isDefault: boolean;
}

export class GetSpacesResponse {
  @ApiProperty({
    type: [SpacesItem],
    isArray: true,
    example: [
      {
        spaceOwnerEmail: 'ao.salenko@gmail.com',
        spaceOwnerName: 'Anastasiia Salenko',
        isDefault: true,
      },
      {
        spaceOwnerEmail: 'ao.salenko+murik@gmail.com',
        spaceOwnerName: 'Dmytro Salenko',
        isDefault: false,
      },
    ],
  })
  items: SpacesItem[];
}
