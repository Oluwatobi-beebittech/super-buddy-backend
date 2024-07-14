import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { EnvConfig } from './config/environment.config';

async function bootstrap() {
  const { APP_SERVER_PORT, FRONTEND_BASE_URL } = EnvConfig;
  const app = await NestFactory.create(AppModule, {
    logger: console,
    cors: {
      origin: [FRONTEND_BASE_URL],
      credentials: true,
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(APP_SERVER_PORT);
}
bootstrap();
