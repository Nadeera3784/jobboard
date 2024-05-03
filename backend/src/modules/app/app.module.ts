import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

import configuration from '../../config/configuration';
import { CategoryModule } from '../category/category.module';
import { LocationModule } from '../location/location.module';
import { UserModule } from '../user/user.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { JobModule } from '../job/job.module';
import {
  AppService,
  CacheService,
  FilesystemService,
  EmailService,
} from './services';
import { AppController } from './controllers/app.controller';
import { GetSharedFiltersFeature } from './features/get-shared-filters.feature';
import { CommandModule } from '../command';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
      cache: false,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database.mongodb.uri'),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('cache.redis.host'),
          port: configService.get('cache.redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get('throttler.ttl'),
          limit: configService.get('throttler.limit'),
        },
      ],
    }),
    EventEmitterModule.forRoot(),
    CategoryModule,
    LocationModule,
    UserModule,
    AuthenticationModule,
    JobModule,
    CommandModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CacheService,
    FilesystemService,
    EmailService,
    GetSharedFiltersFeature,
  ],
  exports: [AppService, CacheService, EmailService, FilesystemService],
})
export class AppModule {}
