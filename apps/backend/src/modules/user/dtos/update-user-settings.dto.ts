import {
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { KeyValueDTO } from './key-value.dto';

export class UpdateUserSettingsDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @MaxLength(10)
  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsObject()
  image?: KeyValueDTO;

  @IsOptional()
  @IsObject()
  resume?: KeyValueDTO;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  streetAddress?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zip?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  comments?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  candidates?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  offers?: boolean;

  @IsOptional()
  @IsString()
  pushNotifications?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  is_two_factor_authentication_enabled?: boolean;
}
