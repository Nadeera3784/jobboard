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
} from './features';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Analytic.name, schema: AnalyticSchema },
      { name: 'Job', schema: require('../job/schemas/job.schema').JobSchema },
      { name: 'Application', schema: require('../job/schemas/application.shema').ApplicationSchema },
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
  ],
  controllers: [AnalyticController],
  exports: [AnalyticService],
})
export class AnalyticModule {}
