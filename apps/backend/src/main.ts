import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { ValidationError, useContainer } from 'class-validator';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { SwaggerModule } from '@nestjs/swagger';
import * as requestIp from 'request-ip';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

import { AppModule } from './modules/app/app.module';
import {
  getAllConstraints,
  getCustomValidationError,
} from './modules/authentication/validations/custome.validation';
import configuration from './config/configuration';
import { ENVIRONMENT_PRODUCTION } from './modules/app/constants';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(
    AppModule,
    new ExpressAdapter(),
  );
  app.enableCors({ origin: true, credentials: true, maxAge: 3600 });
  app.setGlobalPrefix('api/v1', {
    exclude: ['status', 'api-doc'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new HttpException(
          getCustomValidationError(getAllConstraints(errors)),
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
    }),
  );
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(morgan('dev'));
  app.use(requestIp.mw());
  app.enableShutdownHooks();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  if (configuration().app.environment !== ENVIRONMENT_PRODUCTION) {
    const document = JSON.parse(
      (await readFile(join(process.cwd(), 'swagger.json'))).toString('utf-8'),
    );
    SwaggerModule.setup('api-doc', app, document);
  }
  const port = configuration().app.app_port || 3000;
  await app.listen(port);
  return port;
}

bootstrap().then((port) =>
  console.log(`App successfully started on port ${port} !`),
);
