import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from './modules/core/command';
import { AppModule } from './modules/app/app.module';

async function bootstrap(): Promise<void> {
  const app: INestApplicationContext =
    await NestFactory.createApplicationContext(AppModule);
  app.select(CommandModule).get(CommandService).exec();
}

bootstrap().catch();
