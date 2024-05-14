import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  OnApplicationShutdown,
  Logger,
} from '@nestjs/common';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { StatusSideApplicationModule } from './status-app/status-app.module';
import { StatusConfigService } from './status-config.service';
import { StatusMongoApplicationModule } from './status-app/status-mongo-app.module';

@Injectable()
export class StatusAppFactory
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  private app: any;

  constructor(
    private logger: Logger,
    private configService: StatusConfigService,
    private adapterHost: HttpAdapterHost,
  ) {}

  async onModuleInit() {
    const config = this.configService.get();
    const port = config.sideAppPort;
    if (!port) {
      return;
    }
    const module = config.mongodbUrl
      ? StatusMongoApplicationModule
      : StatusSideApplicationModule;
    const adapter =
      (this.adapterHost.httpAdapter && config.httpAdapter) ||
      new ExpressAdapter();
    this.app = await NestFactory.create(module, adapter);
    this.app.useLogger(this.logger);
    this.app.enableCors();
    await this.app.listen(port, '0.0.0.0', () =>
      this.logger.log(
        `Status Application started at port [${port}]`,
        'StatusApplication',
      ),
    );
  }

  async onModuleDestroy() {
    await this.closeApp();
  }

  async onApplicationShutdown(signal: string) {
    await this.closeApp();
  }

  async closeApp() {
    if (this.app) {
      await this.app.close();
    }
  }
}
