import { UnauthorizedException } from '@nestjs/common';

import { BanReasonsEnum } from '../enums/ban-reasons';
import { ERROR_REASONS } from '../constants/ban-reasons';

export class BlockedException extends UnauthorizedException {
  public readonly reason: BanReasonsEnum;

  constructor(reason: BanReasonsEnum) {
    super(ERROR_REASONS[reason]);
    this.reason = reason;
  }
}
