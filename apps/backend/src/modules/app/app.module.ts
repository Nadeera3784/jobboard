import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { EventDispatcherModule } from '../core/event-dispatcher';

import configuration from '../../config/configuration';
import { CategoryModule } from '../category/category.module';
import { LocationModule } from '../location/location.module';
import { UserModule } from '../user/user.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { JobModule } from '../job/job.module';
import { AppService, CacheService, EmailService } from './services';
import { AppController } from './controllers/app.controller';
import { GetSharedFiltersFeature } from './features/get-shared-filters.feature';
import { CommandModule } from '../core/command';
import { FileSystemModule } from '../core/file-system';
import { StatusModule } from '../core/status';

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
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    FileSystemModule.forRootAsync(FileSystemModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          accessKeyId: configService.get('filesystem.disks.s3.key'),
          secretAccessKey: configService.get('filesystem.disks.s3.secret'),
          region: configService.get('filesystem.disks.s3.region'),
          bucket: configService.get('filesystem.disks.s3.bucket'),
        };
      },
    }),
    StatusModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          name: configService.get('app.app_name'),
          version: '1.0.0',
          port: Number(configService.get('app.app_port')),
          environment: configService.get('app.environment'),
          databaseCheck: true,
          type: 'html',
        };
      },
    }),
    CategoryModule,
    LocationModule,
    UserModule,
    AuthenticationModule,
    JobModule,
    CommandModule,
    EventDispatcherModule,
  ],
  controllers: [AppController],
  providers: [AppService, CacheService, EmailService, GetSharedFiltersFeature],
  exports: [AppService, CacheService, EmailService],
})
export class AppModule {}
