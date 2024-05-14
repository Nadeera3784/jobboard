import { DynamicModule, Logger } from '@nestjs/common';
import { StatusAppFactory } from './status-app.factory';
import { StatusConfigService } from './status-config.service';
import { StatusOptionsInterface } from './status-options.interface';

export class StatusModule {
  static forRoot(config?: StatusOptionsInterface): DynamicModule {
    let providers: any[] = [];
    if (config) {
      providers = [
        Logger,
        StatusAppFactory,
        {
          provide: StatusConfigService,
          useValue: new StatusConfigService(config),
        },
      ];
    }
    return {
      module: StatusModule,
      providers: providers,
    };
  }
}
