import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponse {
  @ApiProperty({
    example: {
      email: 'bober@example.com',
      firstName: 'Bober',
      lastName: 'Ivanenko',
    },
  })
  email: string;
  firstName: string;
  lastName: string;
}
