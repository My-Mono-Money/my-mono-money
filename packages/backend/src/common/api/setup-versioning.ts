import { INestApplication, VersioningType } from '@nestjs/common';

export const setupVersioning = (app: INestApplication) => {
  app.enableVersioning({
    type: VersioningType.URI,
  });
};
