export enum BanReasonsEnum {
  REASON_NO_CAPTCHA = 'REASON_NO_CAPTCHA',
  REASON_TWENTY_MINUTES_BAN = 'REASON_20_MINUTES_BAN',
  REASON_THREE_HOURS_BAN = 'REASON_3_HOURS_BAN',
  REASON_PERMANENT_BAN = 'REASON_PERMANENT_BAN',
}

export const BanReasons: BanReasonsEnum[] = [
  BanReasonsEnum.REASON_NO_CAPTCHA,
  BanReasonsEnum.REASON_TWENTY_MINUTES_BAN,
  BanReasonsEnum.REASON_THREE_HOURS_BAN,
  BanReasonsEnum.REASON_PERMANENT_BAN,
];

export const getReasonFromBanCount: (banCount: number) => BanReasonsEnum = (
  banCount: number,
): BanReasonsEnum => BanReasons[banCount - 1];
