import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupVersioning } from './common/api/setup-versioning';
import { setupValidation } from './common/pipes/setup-validation';
import { setupDocs } from './docs/setup-docs';
// try 3
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupVersioning(app);
  setupValidation(app);
  setupDocs(app);

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
