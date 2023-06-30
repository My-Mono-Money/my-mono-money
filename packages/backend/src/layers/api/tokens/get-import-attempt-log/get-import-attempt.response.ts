import { ApiProperty } from '@nestjs/swagger';
import { ImportAttemptStatusType } from '~/storage/interfaces/create-monobank-token-import-attempt-dto.interface';

export class GetImportAttemptResponse {
  @ApiProperty({
    example: {
      id: '6aec4f42-d374-4196-a313-e6327cf273d1',
      fetchedMonths: 193,
      totalMonths: 192,
      log: '- 27 Jun 2023 19:54:08  -  statement import is queued - 27 Jun 2023 19:54:09  -  start of statement import execution - 27 Jun 2023 19:54:09  - The month has been imported, from: 01 Jun 2023 00:00:00  to: 01 Jul 2023 00:00:00  fetched transaction count: 51',
      status: 'successful',
      createdAt: '2023-06-27 16:54:08.986',
      updatedAt: '2023-06-27 17:58:21.323',
    },
  })
  id: string;
  fetchedMonths: number;
  totalMonths: number;
  log: string;
  status: ImportAttemptStatusType;
  createdAt: Date;
  updatedAt: Date;
}
