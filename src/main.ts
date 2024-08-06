//import * as fs from 'fs';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { EnvConfig } from './config/environment.config';

async function bootstrap() {
  const { APP_SERVER_PORT, NOTIONBUDDY_FRONTEND_BASE_URL } = EnvConfig;

  // TODO remove local https setup
  // const httpsOptions = {
  //   key: fs.readFileSync('./src/cert/key.pem'),
  //   cert: fs.readFileSync('./src/cert/cert.pem'),
  // };

  const app = await NestFactory.create(AppModule, {
    logger: console,
    cors: {
      origin: [NOTIONBUDDY_FRONTEND_BASE_URL],
      credentials: true,
    },
    //httpsOptions,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(APP_SERVER_PORT);
}
bootstrap();
