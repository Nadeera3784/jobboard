import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AnalyticController } from './controllers';
import { Analytic, AnalyticSchema } from './schemas';
import { AnalyticService } from './services';
import {
  DeleteAnalyticFeature,
  GetAnalyticByIdFeature,
  UpdateAnalyticCountFeature,
} from './features';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Analytic.name, schema: AnalyticSchema },
    ]),
  ],
  providers: [
    AnalyticService,
    DeleteAnalyticFeature,
    GetAnalyticByIdFeature,
    UpdateAnalyticCountFeature,
  ],
  controllers: [AnalyticController],
  exports: [AnalyticService],
})
export class AnalyticModule {}
