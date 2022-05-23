import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupValidation } from './common/pipes/setup-validation';
import { setupSwagger } from './docs/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupValidation(app);
  setupSwagger(app);

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
