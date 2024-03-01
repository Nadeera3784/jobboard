import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../config/configuration'
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from '../category/category.module';
import { LocationModule } from '../location/location.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AppService } from './services/app.service';
import { AppController } from './controllers/app.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
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
    CategoryModule,
    LocationModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [UserModule],
})
export class AppModule {}
