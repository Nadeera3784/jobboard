import { StatusOptions } from './status-options.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusConfigService {
  constructor(private config: StatusOptions) {}

  get(): StatusOptions {
    return this.config;
  }
}
