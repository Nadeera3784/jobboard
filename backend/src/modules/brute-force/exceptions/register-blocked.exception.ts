import { UnauthorizedException } from '@nestjs/common';
import { REGISTER_ERROR_REASONS } from '../constants/ban-reasons.constants';
import { BanRegistrationsEnum } from '../enums/ban-register.enum';

export class RegisterBlockedException extends UnauthorizedException {
  public readonly reason: BanRegistrationsEnum;

  constructor(reason: BanRegistrationsEnum) {
    super(REGISTER_ERROR_REASONS[reason]);
    this.reason = reason;
  }
}
