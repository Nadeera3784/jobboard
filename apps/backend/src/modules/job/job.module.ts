import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { JobService, ApplicationService } from './services';
import {
  CreateJobFeature,
  GetAllJobsFeature,
  GetJobByIdFeature,
  ApplyJobApplicationFeature,
} from './features';
import { JobController, ApplicationController } from './controllers';
import { JobSeedCommand } from './commands';
import {
  JobSchema,
  Job,
  Application,
  ApplicationSchema,
  Analytic,
  AnalyticSchema,
} from './schemas';
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
      { name: Application.name, schema: ApplicationSchema },
      { name: Analytic.name, schema: AnalyticSchema },
    ]),
    UserModule,
  ],
  controllers: [JobController, ApplicationController],
  providers: [
    JobService,
    ApplicationService,
    CreateJobFeature,
    GetAllJobsFeature,
    GetJobByIdFeature,
    ApplyJobApplicationFeature,
    JobSeedCommand,
    JwtService,
  ],
})
export class JobModule {}
