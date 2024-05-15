import { DynamicModule, Logger, Provider, Type } from '@nestjs/common';
import { StatusAppFactory } from './status-app.factory';
import { StatusConfigService } from './status-config.service';
import { StatusOptions } from './status-options.interface';

export class StatusModule {
  static forRoot(config: StatusOptions): DynamicModule;

  static forRoot(config: StatusOptions): DynamicModule {
    const sharedStatusConfigProvider: Provider = {
      provide: StatusConfigService,
      useValue: new StatusConfigService(config),
    };
    return {
      global: false,
      module: StatusModule,
      providers: [Logger, StatusAppFactory, sharedStatusConfigProvider],
      exports: [sharedStatusConfigProvider],
    };
  }
}
