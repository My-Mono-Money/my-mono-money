import { Module } from '@nestjs/common';
import { DocsController } from './docs.controller';
import { ArchInsightsService } from './services/arch-insights.service';

@Module({
  controllers: [DocsController],
  providers: [ArchInsightsService],
})
export class DocsModule {}
