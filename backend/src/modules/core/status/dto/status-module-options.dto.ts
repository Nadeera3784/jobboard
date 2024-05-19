import {
  IsIn,
  IsInt,
  IsSemVer,
  IsString,
  IsTimeZone,
  IsBoolean,
} from 'class-validator';

class StatusModuleOptions {
  @IsString()
  name: string;

  @IsSemVer()
  version: string;

  @IsIn(['local', 'development', 'staging', 'production'])
  environment: string;

  @IsInt()
  port: number;

  @IsTimeZone()
  timeZone?: string;

  @IsBoolean()
  databaseCheck: boolean;

  @IsIn(['json', 'html'])
  type: string;
}

export { StatusModuleOptions };
