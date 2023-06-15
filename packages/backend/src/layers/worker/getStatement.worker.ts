import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { GetMonobankStatementService } from '../functionality/statement/get-monobank-statement.service';

@Processor('statement')
export class GetStatementWorker {
  constructor(
    private getMonobankStatementService: GetMonobankStatementService,
  ) {}
  @Process({
    concurrency: 1,
  })
  async readOperationJob(
    job: Job<{
      tokenId: string;
      importAttemptId: string;
      spaceOwnerEmail: string;
    }>,
  ) {
    Logger.log(
      `Worker started: ${JSON.stringify(job)}`,
      'Worker',
      job.data,
      'Job Data',
    );
    await this.getMonobankStatementService.getStatement(job.data);
  }
}
