import { NestFactory } from '@nestjs/core';
import { CronModule } from './modules/core/cron/cron.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import configuration from './config/configuration';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(
    CronModule,
    new ExpressAdapter(),
  );
  const port = configuration().app.app_port || 3000;
  await app.listen(port);
  return port;
}

bootstrap().then((port) =>
  console.log(`Cron server successfully started on port ${port} !`),
);
