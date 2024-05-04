import { UnauthorizedException } from '@nestjs/common';
import { REGISTER_ERROR_REASONS } from '../constants/ban-reasons';
import { BanRegistrationsEnum } from '../enums/ban-register';

export class RegisterBlockedException extends UnauthorizedException {
  public readonly reason: BanRegistrationsEnum;

  constructor(reason: BanRegistrationsEnum) {
    super(REGISTER_ERROR_REASONS[reason]);
    this.reason = reason;
  }
}
