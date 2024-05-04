import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { JobSchema, Job } from './schemas/job.schema';
import { JobService } from './services';
import {
  CreateJobFeature,
  GetAllJobsFeature,
  GetJobByIdFeature,
} from './features';
import { JobController } from './controllers/job.controller';
import { JobSeedCommand } from './commands';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Category, CategorySchema } from '../category/schemas/category.schema';
import { Location, LocationSchema } from '../location/schemas/location.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Location.name, schema: LocationSchema },
    ]),
    UserModule,
  ],
  controllers: [JobController],
  providers: [
    JobService,
    CreateJobFeature,
    GetAllJobsFeature,
    GetJobByIdFeature,
    JobSeedCommand,
    JwtService,
    Logger,
  ],
})
export class JobModule {}
