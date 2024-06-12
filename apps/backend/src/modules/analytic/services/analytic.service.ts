import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Analytic } from '../schemas';
import { UpdateCountDto } from '../dtos';

@Injectable()
export class AnalyticService {
  constructor(
    @InjectModel(Analytic.name) private readonly analyticModel: Model<Analytic>,
  ) {}

  public async updateOrCreatCount(updateCountDto: UpdateCountDto) {
    return this.analyticModel
      .findOneAndUpdate(
        { job: updateCountDto.job },
        { $inc: { [updateCountDto.type]: 1 } },
        { new: true, upsert: true },
      )
      .exec();
  }

  public async getByJobId(id: string) {
    return this.analyticModel.findById(id);
  }

  public async delete(id: string) {
    return this.analyticModel.findByIdAndDelete(id);
  }
}
