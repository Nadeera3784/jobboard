import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { SecondFactor } from '../schemas';
import { SecondFactorTokenInterface } from '../interfaces';

@Injectable()
export class CodeNumberGeneratorService {
  constructor(
    @InjectModel(SecondFactor.name)
    private readonly secondFactorTokenModel: Model<SecondFactor>,
  ) {}

  public async generate(userId: string): Promise<number> {
    let code: number;
    let existingCode: SecondFactorTokenInterface;

    do {
      code = CodeNumberGeneratorService.getRandomInt(100000, 999999);

      existingCode = await this.secondFactorTokenModel
        .findOne({ userId, code, active: true })
        .exec();
    } while (existingCode);

    return code;
  }

  private static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
