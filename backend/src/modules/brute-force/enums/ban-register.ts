export enum BanRegistrationsEnum {
  REGISTER_NO_CAPTCHA = 'REASON_NO_CAPTCHA',
  REGISTRATION_TWENTY_MINUTES_BAN = 'REASON_REGISTRATION_20_MINUTES_BAN',
  REGISTRATION_THREE_HOURS_BAN = 'REASON_REGISTRATION_3_HOURS_BAN',
  REGISTRATION_PERMANENT_BAN = 'REASON_REGISTRATION_PERMANENT_BAN',
}

export const BanRegistrations: BanRegistrationsEnum[] = [
  BanRegistrationsEnum.REGISTER_NO_CAPTCHA,
  BanRegistrationsEnum.REGISTRATION_TWENTY_MINUTES_BAN,
  BanRegistrationsEnum.REGISTRATION_THREE_HOURS_BAN,
  BanRegistrationsEnum.REGISTRATION_PERMANENT_BAN,
];

export const getRegistrationBanFromCount: (
  banCount: number,
) => BanRegistrationsEnum = (banCount: number): BanRegistrationsEnum =>
  BanRegistrations[banCount - 1];
