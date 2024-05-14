import { Module } from '@nestjs/common';
import { MongoStatusModule } from './status-mongo/mongo.status.module';

@Module({
  imports: [MongoStatusModule],
})
export class StatusMongoApplicationModule {}
