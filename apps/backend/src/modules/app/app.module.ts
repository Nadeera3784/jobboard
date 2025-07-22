import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { EventDispatcherModule } from '../core/event-dispatcher';
import mongoose from 'mongoose';

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
import { AnalyticModule } from '../analytic/analytic.module';
import { SecondFactorModule } from '../2fa/second-factor.module';

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
        uri: configService.get<string>('database.mongodb.uri'),
        retryAttempts: configService.get<number>(
          'database.mongodb.retry_attempts',
        ),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('cache.redis.host'),
          port: configService.get<number>('cache.redis.port'),
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
          accessKeyId: configService.get<string>('filesystem.disks.s3.key'),
          secretAccessKey: configService.get<string>(
            'filesystem.disks.s3.secret',
          ),
          region: configService.get<string>('filesystem.disks.s3.region'),
          bucket: configService.get<string>('filesystem.disks.s3.bucket'),
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
          environment: configService.get<string>('app.environment'),
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
    AnalyticModule,
    SecondFactorModule,
  ],
  controllers: [AppController],
  providers: [AppService, CacheService, EmailService, GetSharedFiltersFeature],
  exports: [AppService, CacheService, EmailService],
})
export class AppModule implements OnApplicationShutdown {
  onApplicationShutdown(signal: string): void {
    mongoose.disconnect();
    Logger.debug(`Application shut down (signal: ${signal})`);
  }
}
