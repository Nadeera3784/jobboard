import { ExpressAdapter } from '@nestjs/platform-express';
export interface StatusOptionsInterface {
  httpAdapter?: ExpressAdapter;
  mongodbUrl?: string;
  sideAppPort?: number;
}
