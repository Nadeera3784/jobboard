import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { AnalyticController } from './controllers';
import { Analytic, AnalyticSchema } from './schemas';
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
      { name: 'Job', schema: require('../job/schemas/job.schema').JobSchema },
      {
        name: 'Application',
        schema: require('../job/schemas/application.shema').ApplicationSchema,
      },
      {
        name: 'User',
        schema: require('../user/schemas/user.schema').UserSchema,
      },
      {
        name: 'Category',
        schema: require('../category/schemas/category.schema').CategorySchema,
      },
      {
        name: 'Location',
        schema: require('../location/schemas/location.schema').LocationSchema,
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
