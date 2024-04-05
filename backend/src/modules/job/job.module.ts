import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JobSchema, Job } from './schemas/job.schema';
import { JobService } from './services';
import { CreateJobFeature, GetAllJobsFeature } from './features';
import { JobController } from './controllers/job.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])],
  controllers: [JobController],
  providers: [JobService, CreateJobFeature, GetAllJobsFeature],
})
export class JobModule {}
