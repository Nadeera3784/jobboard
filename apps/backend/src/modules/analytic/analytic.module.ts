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
} from './features';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Analytic.name, schema: AnalyticSchema },
    ]),
    UserModule
  ],
  providers: [
    JwtService,
    AnalyticService,
    DeleteAnalyticFeature,
    GetAnalyticByIdFeature,
    UpdateAnalyticCountFeature,
  ],
  controllers: [AnalyticController],
  exports: [AnalyticService],
})
export class AnalyticModule {}
