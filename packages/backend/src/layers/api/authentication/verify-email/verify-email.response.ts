import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhby5zYWxlbmtvK2pvaG5ueS5kZXBwQGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6ItCU0LbQvtC90L3RliIsImxhc3ROYW1lIjoi0JTQtdC_0L8iLCJzaWQiOiJjYzhlNjQzNi0wMmY0LTQ2OGMtOTE2ZC05YjkzMDAwNDcxNzciLCJpYXQiOjE1MTYyMzkwMjJ9.DM5XibsUN6PNz2rEjmrVA9_MuCVrYi1I4HoPaXY-fEE',
  })
  accessToken: string;
}
