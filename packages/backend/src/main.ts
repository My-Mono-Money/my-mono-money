import { NestFactory } from '@nestjs/core';
import { setupDocs } from './docs/setup-docs';
import { BackendAppModule } from './backend-app.module';
import { WorkerAppModule } from './worker-app.module';
import { setupVersioning } from './common/api/setup-versioning';
import { setupValidation } from './common/pipes/setup-validation';

const port = Number(process.env.PORT || 8080);

async function bootstrapBackendApp() {
  const app = await NestFactory.create(BackendAppModule);
  setupVersioning(app);
  setupValidation(app);
  setupDocs(app);
  app.enableCors();
  await app.listen(port);
}

async function bootstrapWorkerApp() {
  const app = await NestFactory.create(WorkerAppModule);

  await app.listen(port + 1);
}

const bootstrap = process.env.MMM_WORKER_MODE
  ? bootstrapWorkerApp
  : bootstrapBackendApp;

bootstrap();
