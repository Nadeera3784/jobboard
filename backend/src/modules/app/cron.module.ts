import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import configuration from '../../config/configuration';
import { UserModule } from '../user/user.module';;
import { UserInactivityDetectionCron } from '../user/cron';
import { DetectInactiveUsersFeature } from '../user/features';
import { InactivityReminderQueue } from '../user/queues';
import { EmailService } from './services/email.service';

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
        uri: configService.get('database.mongodb.uri')
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
    BullModule.registerQueue(
      {
        name: 'inactivity-reminder-email',
      },
    ),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule,
  ],
  providers: [
    Logger,
    EmailService,
    UserInactivityDetectionCron,
    DetectInactiveUsersFeature,
    InactivityReminderQueue,
  ],
  exports: [],
})
export class CronModule {}
