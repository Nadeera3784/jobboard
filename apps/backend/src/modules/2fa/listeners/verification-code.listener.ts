import { Injectable } from '@nestjs/common';
import { EventListener } from '../../core/event-dispatcher';

import { SendVerificationCodeEvent } from '../events';
import { SecondFactorService } from '../services';
import { SEND_SECOND_FACTOR_VERIFICATION_CODE } from '../constants';

@Injectable()
export class VerificationCodeListener {
  constructor(private readonly secondFactorService: SecondFactorService) {}

  @EventListener({
    eventName: SEND_SECOND_FACTOR_VERIFICATION_CODE,
    priority: 1,
  })
  async onSendSecondFactorVerificationCodeEvent(
    event: SendVerificationCodeEvent,
  ) {
    await this.secondFactorService.sendSecondFactorVerificationCodeEmail(event);
  }
}
