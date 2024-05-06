import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { ValidationError, useContainer } from 'class-validator';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { SwaggerModule } from '@nestjs/swagger';
import * as requestIp from 'request-ip';

import { AppModule } from './modules/app/app.module';
import {
  getAllConstraints,
  getCustomValidationError,
} from './modules/authentication/validations/custome.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true, maxAge: 3600 });
  app.setGlobalPrefix('api/v1');
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) =>
        new HttpException(
          getCustomValidationError(getAllConstraints(errors)),
          HttpStatus.BAD_REQUEST,
        ),
    }),
  );
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(morgan('dev'));
  app.use(requestIp.mw());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  //TODO: only run on dev env
  const document = JSON.parse(
    (await readFile(join(process.cwd(), 'swagger.json'))).toString('utf-8'),
  );
  SwaggerModule.setup('api-doc', app, document);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  return port;
}

bootstrap().then((port) =>
  console.log(`App successfully started on port ${port} !`),
);
