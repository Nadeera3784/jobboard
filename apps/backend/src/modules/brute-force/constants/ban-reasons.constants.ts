import { BanReasonsEnum } from '../enums/ban-reasons.enum';
import { BanRegistrationsEnum } from '../enums/ban-register.enum';

const REASON_NO_CAPTCHA = 'auth.error.reason.no_captcha';
const REASON_TWENTY_MINUTES_BAN = 'auth.error.reason.twenty_minutes_ban';
const REASON_THREE_HOURS_BAN = 'auth.error.reason.three_hours_ban';
const REASON_PERMANENT_BAN = 'auth.error.reason.permanent_ban';
const REGISTER_TWENTY_MINUTES_BAN =
  'auth.register.error.reason.twenty_minutes_ban';
const REGISTER_THREE_HOURS_BAN = 'auth.register.error.reason.three_hours_ban';
const REGISTER_PERMANENT_BAN = 'auth.register.error.reason.permanent_ban';
export const SECURITY_QUESTION_BAN = 'auth.security-question.error.reason.ban';

type IEnumTpProp<R> = { [key in BanReasonsEnum]: R };

export const ERROR_REASONS: IEnumTpProp<string> = {
  [BanReasonsEnum.REASON_NO_CAPTCHA]: REASON_NO_CAPTCHA,
  [BanReasonsEnum.REASON_PERMANENT_BAN]: REASON_PERMANENT_BAN,
  [BanReasonsEnum.REASON_TWENTY_MINUTES_BAN]: REASON_TWENTY_MINUTES_BAN,
  [BanReasonsEnum.REASON_THREE_HOURS_BAN]: REASON_THREE_HOURS_BAN,
};

type IEnumRegistration<R> = { [key in BanRegistrationsEnum]: R };

export const REGISTER_ERROR_REASONS: IEnumRegistration<string> = {
  [BanRegistrationsEnum.REGISTER_NO_CAPTCHA]: REASON_NO_CAPTCHA,
  [BanRegistrationsEnum.REGISTRATION_PERMANENT_BAN]: REGISTER_PERMANENT_BAN,
  [BanRegistrationsEnum.REGISTRATION_TWENTY_MINUTES_BAN]:
    REGISTER_TWENTY_MINUTES_BAN,
  [BanRegistrationsEnum.REGISTRATION_THREE_HOURS_BAN]: REGISTER_THREE_HOURS_BAN,
};

export const MAX_BAN_COUNT = 4;
