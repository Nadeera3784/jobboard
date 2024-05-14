import { StatusOptionsInterface } from './status-options.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusConfigService {
  constructor(private config: StatusOptionsInterface) {}

  get(): StatusOptionsInterface {
    return this.config;
  }
}
