import { ExpressAdapter } from '@nestjs/platform-express';

export interface StatusOptions {
  httpAdapter?: ExpressAdapter;
  mongodbUrl?: string;
  sideAppPort?: number;
}