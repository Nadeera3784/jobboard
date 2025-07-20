import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { AnalyticController } from './controllers';
import { Analytic, AnalyticSchema } from './schemas';
import { Job, JobSchema, Application, ApplicationSchema } from '../job/schemas';
import { User, UserSchema } from '../user/schemas';
import { Category, CategorySchema } from '../category/schemas';
import { Location, LocationSchema } from '../location/schemas';
import { AnalyticService } from './services';
import {
  DeleteAnalyticFeature,
  GetAnalyticByIdFeature,
  UpdateAnalyticCountFeature,
  GetCompanyAnalyticsFeature,
  GetUserAnalyticsFeature,
  GetAdminAnalyticsFeature,
} from './features';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Analytic.name, schema: AnalyticSchema },
      { name: Job.name, schema: JobSchema },
      {
        name: Application.name,
        schema: ApplicationSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Location.name,
        schema: LocationSchema,
      },
    ]),
    UserModule,
  ],
  providers: [
    JwtService,
    AnalyticService,
    DeleteAnalyticFeature,
    GetAnalyticByIdFeature,
    UpdateAnalyticCountFeature,
    GetCompanyAnalyticsFeature,
    GetUserAnalyticsFeature,
    GetAdminAnalyticsFeature,
  ],
  controllers: [AnalyticController],
  exports: [AnalyticService],
})
export class AnalyticModule {}
