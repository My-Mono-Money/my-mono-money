import { Controller, Get, Param } from '@nestjs/common';
import { marked } from 'marked';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { ArchInsightsService } from './services/arch-insights.service';
import { IsOptional, IsString, Matches } from 'class-validator';

class DocsPageNameParams {
  @IsOptional()
  @IsString()
  @Matches(/[a-z0-9-]+/)
  pageName?: string;
}

@Controller({ path: '/docs' })
export class DocsController {
  constructor(private archService: ArchInsightsService) {}

  @Get('/')
  index() {
    return this.docs();
  }

  @Get('/:pageName')
  docs(@Param() params: DocsPageNameParams = {}) {
    const { pageName = 'index' } = params;
    const templateText = fs
      .readFileSync(`${__dirname}/pages/${pageName}.template.md`)
      .toString();
    const template = handlebars.compile(templateText);
    const markdown = template(this.getTemplateVars());
    const html = marked.parse(markdown).replace(/&amp;gt;/g, '>');

    return html;
  }

  getTemplateVars() {
    return {
      archDiagram: this.archService.getArchDiagram(),
    };
  }
}
