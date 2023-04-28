import { NestFactory } from '@nestjs/core';
import * as cors from 'cors';
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
  app.use(
    cors({
      origin: [
        process.env.ENVIRONMENT_FRONTEND_DOMAIN,
        'http://localhost:3000',
      ],
    }),
  );
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
