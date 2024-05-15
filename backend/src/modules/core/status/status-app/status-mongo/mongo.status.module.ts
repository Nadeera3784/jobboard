import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiStatusHttpController } from './api-status.controller';
import { StatusConfigService } from '../../status-config.service';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  controllers: [ApiStatusHttpController],
  imports: [
    /*
    MongooseModule.forRoot('mongodb://localhost:27017/jobboard'),
    MongooseModule.forRootAsync({
      useFactory: (configService: StatusConfigService) => ({
         uri:  configService.get().mongodbUrl
      }),
      inject: [StatusConfigService],
    }),
    */
    TerminusModule,
  ],
})
export class MongoStatusModule {}
