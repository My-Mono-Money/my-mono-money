import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { GetMonobankStatementService } from '../functionality/statement/get-monobank-statement.service';

@Processor('statement')
export class GetStatementConsumer {
  constructor(
    private getMonobankStatementService: GetMonobankStatementService,
  ) {}
  @Process({
    concurrency: 1,
  })
  async readOperationJob(job: Job<{ tokenId: string }>) {
    Logger.log(`Worker started: ${JSON.stringify(job)}`, 'Worker');
    await this.getMonobankStatementService.getStatement(job.data);
  }
}
