import { NestFactory } from '@nestjs/core';
import { CronModule } from './modules/app/cron.module';

async function bootstrap() {
    const app = await NestFactory.create(CronModule);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    return port;
}
  
bootstrap().then((port) =>
   console.log(`Cron server successfully started on port ${port} !`),
);
  