import { Module } from '@nestjs/common';
import { FunctionalityModule } from '../functionality/functionality.module';

@Module({ imports: [FunctionalityModule] })
export class WorkerLayerModule {}
